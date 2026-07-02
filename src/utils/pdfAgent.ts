import { PDFDocument, rgb, degrees, StandardFonts, PDFName } from "pdf-lib";
// @ts-ignore
import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";

export interface AgentLog {
  timestamp: string;
  type: "info" | "success" | "warn" | "error";
  message: string;
}

export interface AgentResult {
  pdfDoc: PDFDocument;
  logs: AgentLog[];
  modified: boolean;
  encryptedBytes?: Uint8Array;
}

// Reusable logger helper
const createLog = (message: string, type: AgentLog["type"] = "info"): AgentLog => ({
  timestamp: new Date().toLocaleTimeString(),
  type,
  message,
});

/**
 * Natural Language Prompt Parser & Executor for PDFDocument
 */
export async function executeAgentPrompt(
  pdfDoc: PDFDocument,
  prompt: string,
  pdfjsLib: any // Pass pdfjsLib dynamically to avoid SSR load failures
): Promise<AgentResult> {
  const logs: AgentLog[] = [];
  let modified = false;

  logs.push(createLog("Initializing Autonomous PDF Agent...", "info"));
  logs.push(createLog(`Analyzing prompt: "${prompt}"`, "info"));

  const normalizedPrompt = prompt.toLowerCase();
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  try {
    // -------------------------------------------------------------
    // ACTION 1: ROTATE PAGES
    // e.g. "rotate page 1 90 degrees" or "rotate all pages 180"
    // -------------------------------------------------------------
    if (normalizedPrompt.includes("rotate") || normalizedPrompt.includes("turn")) {
      logs.push(createLog("› Action identified: Rotate pages", "info"));
      
      // Determine angle
      let angle = 90;
      if (normalizedPrompt.includes("180")) angle = 180;
      else if (normalizedPrompt.includes("270")) angle = 270;
      
      // Determine pages
      let targetPages: number[] = [];
      if (normalizedPrompt.includes("all")) {
        targetPages = Array.from({ length: totalPages }).map((_, i) => i);
      } else {
        // Extract numbers from the prompt to identify pages
        const matches = normalizedPrompt.match(/page\s*(\d+)/g);
        if (matches) {
          matches.forEach((m) => {
            const num = parseInt(m.replace(/\D/g, ""), 10);
            if (num >= 1 && num <= totalPages) {
              targetPages.push(num - 1); // 0-indexed
            }
          });
        } else {
          // Fallback: Check if there's any standalone digit indicating page
          const digits = normalizedPrompt.match(/\b\d+\b/g);
          if (digits) {
            digits.forEach((d) => {
              const num = parseInt(d, 10);
              if (num >= 1 && num <= totalPages && num !== 90 && num !== 180 && num !== 270) {
                targetPages.push(num - 1);
              }
            });
          }
        }
      }

      // If no page specified, rotate all pages
      if (targetPages.length === 0) {
        logs.push(createLog("No target page specified. Defaulting to all pages.", "warn"));
        targetPages = Array.from({ length: totalPages }).map((_, i) => i);
      }

      targetPages.forEach((idx) => {
        const page = pages[idx];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + angle) % 360));
        logs.push(createLog(`Page ${idx + 1} rotated by ${angle}° (New: ${(currentRotation + angle) % 360}°)`, "success"));
      });
      modified = true;
    }

    // -------------------------------------------------------------
    // ACTION 2: SMART AUTO-REDACTION (EMAILS & PHONES)
    // e.g. "redact emails" or "mask phones" or "blackout credentials"
    // -------------------------------------------------------------
    if (
      normalizedPrompt.includes("redact") || 
      normalizedPrompt.includes("mask") || 
      normalizedPrompt.includes("blackout") || 
      normalizedPrompt.includes("hide")
    ) {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
      
      const shouldRedactEmail = normalizedPrompt.includes("email") || normalizedPrompt.includes("pii") || normalizedPrompt.includes("all");
      const shouldRedactPhone = normalizedPrompt.includes("phone") || normalizedPrompt.includes("number") || normalizedPrompt.includes("pii") || normalizedPrompt.includes("all");

      if (shouldRedactEmail || shouldRedactPhone) {
        logs.push(createLog("› Action identified: Smart Auto-Redaction", "info"));
        
        // Extract array bytes to scan text positions
        const pdfBytes = await pdfDoc.save();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) });
        const pdfJsDoc = await loadingTask.promise;
        let redactionsCount = 0;

        for (let i = 1; i <= pdfJsDoc.numPages; i++) {
          const page = await pdfJsDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pdfLibPage = pages[i - 1];

          textContent.items.forEach((item: any) => {
            const text = item.str;
            const matchesEmail = shouldRedactEmail && emailRegex.test(text);
            const matchesPhone = shouldRedactPhone && phoneRegex.test(text);

            if (matchesEmail || matchesPhone) {
              const transform = item.transform;
              const x = transform[4];
              const y = transform[5];
              const fontSize = Math.abs(transform[0] || transform[3] || 10);
              const rectWidth = item.width || (text.length * fontSize * 0.5);
              const rectHeight = item.height || (fontSize * 1.2);

              pdfLibPage.drawRectangle({
                x: x - 2,
                y: y - 2,
                width: rectWidth + 4,
                height: rectHeight + 4,
                color: rgb(0, 0, 0),
              });
              redactionsCount++;
            }
          });
        }

        // Clean metadata catalog
        try {
          pdfDoc.catalog.delete(PDFName.of("Metadata"));
        } catch {}

        logs.push(createLog(`Auto-redacted ${redactionsCount} instances of sensitive PII.`, "success"));
        modified = true;
      }
    }

    // -------------------------------------------------------------
    // ACTION 3: ADD WATERMARK
    // e.g. "watermark CONFIDENTIAL" or "add watermark DRAFT"
    // -------------------------------------------------------------
    if (normalizedPrompt.includes("watermark") || normalizedPrompt.includes("stamp")) {
      logs.push(createLog("› Action identified: Add Watermark", "info"));
      
      // Extract watermark text (anything after "watermark" or "stamp")
      let text = "CONFIDENTIAL";
      const parts = prompt.split(/watermark|stamp/i);
      if (parts.length > 1 && parts[1].trim().length > 0) {
        text = parts[1].replace(/['"“”]/g, "").trim().toUpperCase();
      }

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 50;

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        const x = width / 2;
        const y = height / 2;

        page.drawText(text, {
          x: x - (textWidth / 2) * Math.cos((-45 * Math.PI) / 180),
          y: y - (fontSize / 2) * Math.sin((-45 * Math.PI) / 180),
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.8, 0.2, 0.2),
          opacity: 0.25,
          rotate: degrees(-45),
        });
      });

      logs.push(createLog(`Applied watermark "${text}" to all pages.`, "success"));
      modified = true;
    }

    // -------------------------------------------------------------
    // ACTION 4: ADD PAGE NUMBERS
    // e.g. "add page numbers" or "number pages"
    // -------------------------------------------------------------
    if (normalizedPrompt.includes("number") || normalizedPrompt.includes("numeral")) {
      logs.push(createLog("› Action identified: Add Page Numbering", "info"));
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 9;

      pages.forEach((page, index) => {
        const { width } = page.getSize();
        const text = `Page ${index + 1} of ${totalPages}`;
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: 25,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      logs.push(createLog(`Numbered all ${totalPages} pages at bottom center.`, "success"));
      modified = true;
    }

    // -------------------------------------------------------------
    // ACTION 5: PASSWORD PROTECTION
    // e.g. "password protect file '1234'" or "encrypt with password secure"
    // -------------------------------------------------------------
    if (
      normalizedPrompt.includes("password") || 
      normalizedPrompt.includes("encrypt") || 
      normalizedPrompt.includes("protect")
    ) {
      logs.push(createLog("› Action identified: Protect PDF", "info"));
      
      // Extract password (look for single quoted strings or words after password)
      let password = "pdfghost_secured";
      const matches = prompt.match(/(?:password|encrypt|protect)\s+(?:to|with|value)?\s*['"]?([a-zA-Z0-9@#$!%*?&]+)['"]?/i);
      
      let passwordToApply = "";
      if (matches && matches[1]) {
        passwordToApply = matches[1];
      } else {
        // Fallback: look for the last word of the prompt if it doesn't match keys
        const words = normalizedPrompt.split(/\s+/);
        const lastWord = words[words.length - 1];
        if (lastWord && lastWord !== "password" && lastWord !== "protect" && lastWord !== "encrypt") {
          passwordToApply = lastWord.replace(/['"“]/g, "");
        }
      }

      if (passwordToApply) {
        logs.push(createLog(`Queued document protection with password: "${passwordToApply}"`, "success"));
        modified = true;
        // We will run the encryption on the saved bytes during final post-processing
        (pdfDoc as any)._passwordToApply = passwordToApply;
      }
    }

    if (!modified) {
      logs.push(createLog("Could not map instructions to any automated agent actions. Try using terms like 'rotate', 'watermark', 'redact emails', or 'password protect'.", "warn"));
    } else {
      logs.push(createLog("✔ Execution completed successfully!", "success"));
    }

  } catch (err: any) {
    console.error(err);
    logs.push(createLog(`Execution failed: ${err.message || String(err)}`, "error"));
  }

  let encryptedBytes: Uint8Array | undefined = undefined;
  const passwordToApply = (pdfDoc as any)._passwordToApply;
  if (modified && passwordToApply) {
    try {
      const savedBytes = await pdfDoc.save();
      encryptedBytes = await encryptPDF(savedBytes, passwordToApply);
      logs.push(createLog("Encryption key layers applied to document stream successfully.", "success"));
    } catch (encErr: any) {
      logs.push(createLog(`Failed to apply encryption: ${encErr.message || String(encErr)}`, "error"));
    }
  }

  return { pdfDoc, logs, modified, encryptedBytes };
}
