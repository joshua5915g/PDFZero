export type ToolCategory = 
  | "pdf" 
  | "image" 
  | "converter" 
  | "calculator" 
  | "marketing" 
  | "fun";

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: ToolCategory;
  tags: string[];
  iconName: string;
  badge?: "Popular" | "New" | "AI" | "Pro";
}

export const CATEGORY_METADATA: Record<ToolCategory, { name: string; description: string; count: number; color: string }> = {
  pdf: {
    name: "PDF Tools",
    description: "Edit, merge, compress, protect, convert and OCR PDF files completely client-side.",
    count: 36,
    color: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30"
  },
  image: {
    name: "Image Studio",
    description: "Compress, resize, convert, and edit images without uploading to any server.",
    count: 30,
    color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
  },
  converter: {
    name: "Converters & Dev",
    description: "Developer utilities, JSON validators, Base64, regex, hashing, and code formatters.",
    count: 29,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
  },
  calculator: {
    name: "Calculators & Units",
    description: "Financial, mortgage, tax, health, BMI, and rapid metric/imperial unit converters.",
    count: 42,
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30"
  },
  marketing: {
    name: "Business & Marketing",
    description: "Generate professional invoices, receipts, pay stubs, resumes, barcodes, and QR codes.",
    count: 12,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30"
  },
  fun: {
    name: "Design & Web Fun",
    description: "CSS gradient and glassmorphism builders, color palettes, retro typing, and web games.",
    count: 15,
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30"
  }
};

export const ALL_TOOLS: ToolItem[] = [
  // ==========================================
  // 1. PDF TOOLS (36)
  // ==========================================
  { id: "merge-pdf", title: "PDF Merger", description: "Combine multiple PDF documents into a single organized file.", url: "/merge-pdf", category: "pdf", tags: ["merge", "combine", "join"], iconName: "Combine", badge: "Popular" },
  { id: "split-pdf", title: "PDF Splitter", description: "Split PDF pages into separate documents or extract specific page ranges.", url: "/split-pdf", category: "pdf", tags: ["split", "separate", "extract"], iconName: "Split" },
  { id: "compress-pdf", title: "PDF Compressor", description: "Shrink PDF file sizes while maintaining sharp text and visual clarity.", url: "/compress-pdf", category: "pdf", tags: ["compress", "reduce", "shrink", "optimize"], iconName: "FileDown", badge: "Popular" },
  { id: "edit-pdf", title: "PDF Editor", description: "Directly annotate, draw, and modify text elements within any PDF.", url: "/edit-pdf", category: "pdf", tags: ["edit", "annotate", "text", "draw"], iconName: "PenTool", badge: "New" },
  { id: "sign-pdf", title: "Sign PDF", description: "Create, draw, or upload verified digital signatures onto documents.", url: "/sign-pdf", category: "pdf", tags: ["sign", "signature", "stamp"], iconName: "FileSignature", badge: "Pro" },
  { id: "protect-pdf", title: "Protect PDF", description: "Encrypt documents with standard AES-256 passwords and permissions.", url: "/protect-pdf", category: "pdf", tags: ["protect", "lock", "encrypt", "password"], iconName: "Lock" },
  { id: "unlock-pdf", title: "Unlock PDF", description: "Strip password security and document restrictions permanently.", url: "/unlock-pdf", category: "pdf", tags: ["unlock", "decrypt", "password"], iconName: "Unlock" },
  { id: "rotate-pdf", title: "Rotate PDF", description: "Rotate 90, 180, or 270 degrees per page or across the entire document.", url: "/rotate-pdf", category: "pdf", tags: ["rotate", "turn", "orientation"], iconName: "RotateCw" },
  { id: "remove-pages", title: "Delete PDF Pages", description: "Remove unwanted pages with interactive visual thumbnail preview.", url: "/remove-pages", category: "pdf", tags: ["delete", "remove", "pages"], iconName: "Trash2" },
  { id: "organize-pdf", title: "Organize PDF", description: "Drag and drop thumbnails to re-sequence and organize PDF decks.", url: "/organize-pdf", category: "pdf", tags: ["organize", "reorder", "resequence"], iconName: "LayoutGrid" },
  { id: "add-watermark", title: "Add Watermark", description: "Stamp custom text or image watermarks across every page.", url: "/add-watermark", category: "pdf", tags: ["watermark", "stamp", "branding"], iconName: "Stamp" },
  { id: "redact-pdf", title: "Smart Redact PDF", description: "Blackout confidential data and PII with coordinate precision.", url: "/redact-pdf", category: "pdf", tags: ["redact", "blackout", "privacy", "security"], iconName: "EyeOff", badge: "AI" },
  { id: "ocr-enhanced", title: "PDF to OCR", description: "Transform scanned image PDFs into searchable selectable text.", url: "/ocr-enhanced", category: "pdf", tags: ["ocr", "searchable", "scan"], iconName: "ScanText", badge: "AI" },
  { id: "extract-text", title: "PDF to TXT", description: "Extract clean raw plain text directly from document streams.", url: "/extract-text", category: "pdf", tags: ["extract", "text", "txt"], iconName: "FileText" },
  { id: "extract-table", title: "Extract Tables", description: "Detect tabular grids and download CSV/XLSX data sheets.", url: "/extract-table", category: "pdf", tags: ["table", "csv", "excel", "sheets"], iconName: "Table" },
  { id: "pdf-to-word", title: "PDF to Word", description: "Convert PDF documents into editable Microsoft Word (.docx) files.", url: "/pdf-to-word", category: "pdf", tags: ["word", "docx", "convert"], iconName: "FileText", badge: "Popular" },
  { id: "word-to-pdf", title: "Word to PDF", description: "Convert DOC and DOCX files into standard vector PDF pages.", url: "/word-to-pdf", category: "pdf", tags: ["word", "docx", "to-pdf"], iconName: "FileUp" },
  { id: "pdf-to-excel", title: "PDF to Excel", description: "Convert PDF financial statements and tables into XLSX spreadsheets.", url: "/pdf-to-excel", category: "pdf", tags: ["excel", "xlsx", "spreadsheet"], iconName: "FileSpreadsheet" },
  { id: "excel-to-pdf", title: "Excel to PDF", description: "Convert Excel (.xlsx/.xls) spreadsheets into paginated PDF layouts.", url: "/excel-to-pdf", category: "pdf", tags: ["excel", "xlsx", "sheet"], iconName: "Sheet" },
  { id: "pdf-to-pptx", title: "PDF to PowerPoint", description: "Convert PDF presentation decks into editable PowerPoint slides.", url: "/pdf-to-pptx", category: "pdf", tags: ["pptx", "powerpoint", "slides"], iconName: "Presentation" },
  { id: "pptx-to-pdf", title: "PPTX to PDF", description: "Convert PowerPoint slide decks into clean portable PDF decks.", url: "/pptx-to-pdf", category: "pdf", tags: ["powerpoint", "pptx", "to-pdf"], iconName: "Presentation" },
  { id: "img-to-pdf", title: "Images to PDF", description: "Combine JPG, PNG, WebP photos into a multi-page PDF document.", url: "/img-to-pdf", category: "pdf", tags: ["images", "jpg", "png", "photo"], iconName: "Images", badge: "Popular" },
  { id: "pdf-to-img", title: "PDF to PNG / JPG", description: "Render every PDF page into high-resolution lossless images.", url: "/pdf-to-img", category: "pdf", tags: ["pdf-to-image", "png", "jpg"], iconName: "Image" },
  { id: "html-to-pdf", title: "HTML / URL to PDF", description: "Render raw HTML or public web pages into downloadable PDFs.", url: "/html-to-pdf", category: "pdf", tags: ["html", "url", "webpage"], iconName: "Globe" },
  { id: "markdown-to-pdf", title: "Markdown to PDF", description: "Convert Markdown syntax (.md) into clean formatted A4 PDFs.", url: "/markdown-to-pdf", category: "pdf", tags: ["markdown", "md", "docs"], iconName: "FileCode", badge: "New" },
  { id: "pdf-to-markdown", title: "PDF to Markdown", description: "Extract headers, tables, and paragraphs as structured Markdown.", url: "/pdf-to-markdown", category: "pdf", tags: ["markdown", "ai", "structure"], iconName: "FileText", badge: "AI" },
  { id: "pdf-to-pdfa", title: "PDF to PDF/A", description: "Convert standard PDFs to ISO 19005 compliant archival format.", url: "/pdf-to-pdfa", category: "pdf", tags: ["pdfa", "archive", "iso"], iconName: "Archive" },
  { id: "compare-pdf", title: "Compare PDFs", description: "Visual side-by-side text diff checker for revisions.", url: "/compare-pdf", category: "pdf", tags: ["compare", "diff", "revisions"], iconName: "GitCompare" },
  { id: "crop-pdf", title: "Crop PDF", description: "Trim page margins and adjust viewport boundaries visually.", url: "/crop-pdf", category: "pdf", tags: ["crop", "margins", "trim"], iconName: "Crop" },
  { id: "add-page-numbers", title: "Page Numbers", description: "Insert automated numbering headers and footers to all pages.", url: "/add-page-numbers", category: "pdf", tags: ["numbers", "pagination", "footer"], iconName: "Hash" },
  { id: "ai-chat", title: "Edge AI Document Chat", description: "Chat and ask questions about your PDF with 100% private local AI.", url: "/ai-chat", category: "pdf", tags: ["ai", "chat", "summary", "gpt"], iconName: "Bot", badge: "AI" },
  { id: "ai-summarize", title: "AI Document Summarizer", description: "Generate concise key takeaway executive summaries of long PDFs.", url: "/ai-summarize", category: "pdf", tags: ["ai", "summary", "brief"], iconName: "Sparkles", badge: "AI" },
  { id: "ai-translate", title: "AI Document Translator", description: "Translate entire PDF content into 50+ languages preserving layout.", url: "/ai-translate", category: "pdf", tags: ["ai", "translate", "languages"], iconName: "Languages", badge: "AI" },
  { id: "repair-pdf", title: "Repair PDF", description: "Recover and rebuild damaged, corrupted, or unreadable PDF streams.", url: "/repair-pdf", category: "pdf", tags: ["repair", "fix", "corrupt"], iconName: "Wrench" },
  { id: "scan-to-pdf", title: "Scan to PDF", description: "Use your device webcam or camera to capture documents into PDF.", url: "/scan-to-pdf", category: "pdf", tags: ["scan", "camera", "webcam"], iconName: "Camera" },
  { id: "pdf-forms", title: "Fill PDF Forms", description: "Interactively fill out, save, and flatten AcroForm PDF inputs.", url: "/pdf-forms", category: "pdf", tags: ["forms", "acroform", "fill"], iconName: "CheckSquare" },

  // ==========================================
  // 2. IMAGE TOOLS (30)
  // ==========================================
  { id: "image-compressor", title: "Image Compressor", description: "Reduce image file sizes with quality slider without losing clarity.", url: "/image-compressor", category: "image", tags: ["image", "compress", "shrink", "jpg", "png"], iconName: "Minimize2", badge: "Popular" },
  { id: "image-resizer", title: "Image Resizer", description: "Resize image dimensions by pixels or aspect-ratio percentage.", url: "/image-resizer", category: "image", tags: ["resize", "dimensions", "scale"], iconName: "Maximize2" },
  { id: "image-flipper", title: "Image Flipper", description: "Flip images horizontally or vertically in one instantaneous click.", url: "/image-flipper", category: "image", tags: ["flip", "mirror", "rotate"], iconName: "FlipHorizontal" },
  { id: "image-color-picker", title: "Image Color Picker", description: "Pick HEX, RGB, and HSL color codes from any uploaded image.", url: "/image-color-picker", category: "image", tags: ["color", "picker", "eyedropper", "hex", "rgb"], iconName: "Pipette" },
  { id: "format-converter", title: "Image Format Converter", description: "Convert between WebP, PNG, JPG, and AVIF in the browser.", url: "/format-converter", category: "image", tags: ["convert", "webp", "jpg", "png", "avif"], iconName: "RefreshCw", badge: "Popular" },
  { id: "heic-to-jpg", title: "HEIC to JPG / PNG", description: "Convert Apple iPhone HEIC/HEIF photos to universal JPG or PNG.", url: "/heic-to-jpg", category: "image", tags: ["heic", "iphone", "apple", "jpg"], iconName: "Smartphone" },
  { id: "svg-to-png", title: "SVG to PNG Converter", description: "Render scalable vector SVG graphics into high-res PNG images.", url: "/svg-to-png", category: "image", tags: ["svg", "png", "vector"], iconName: "Vector" },
  { id: "png-to-svg", title: "PNG to SVG Converter", description: "Vectorize raster PNG images into scalable vector graphics.", url: "/png-to-svg", category: "image", tags: ["png", "svg", "vectorize"], iconName: "Sparkles" },
  { id: "watermark-eraser", title: "Watermark Eraser", description: "Blur, inpaint, or pixelate watermarks and stamps from images.", url: "/watermark-eraser", category: "image", tags: ["watermark", "erase", "remove", "clean"], iconName: "Eraser" },
  { id: "gif-maker", title: "GIF Maker", description: "Create animated GIFs from frames or sequences of photos.", url: "/gif-maker", category: "image", tags: ["gif", "animation", "maker"], iconName: "Film" },
  { id: "compress-gif", title: "Compress GIF", description: "Optimize and shrink animated GIF file sizes by reducing colors.", url: "/compress-gif", category: "image", tags: ["gif", "compress", "optimize"], iconName: "FileDown" },
  { id: "image-to-text", title: "Image to Text (OCR)", description: "Extract text directly from screenshots and photos using OCR.", url: "/image-to-text", category: "image", tags: ["ocr", "image", "text", "extract"], iconName: "ScanText", badge: "AI" },
  { id: "background-remover", title: "Image Background Remover", description: "Cut out photo backgrounds cleanly with client-side AI detection.", url: "/background-remover", category: "image", tags: ["background", "cutout", "transparent"], iconName: "Scissors", badge: "AI" },
  { id: "gps-photo-stamper", title: "GPS Photo Stamper", description: "Stamp photo metadata (GPS coordinates, date/time) directly onto image.", url: "/gps-photo-stamper", category: "image", tags: ["gps", "exif", "timestamp", "photo"], iconName: "MapPin" },
  { id: "linkedin-photo-frame", title: "LinkedIn Frame Editor", description: "Add #OpenToWork, #Hiring, or custom circular badges to profile photos.", url: "/linkedin-photo-frame", category: "image", tags: ["linkedin", "avatar", "frame", "badge"], iconName: "UserCheck" },

  // Format pair aliases
  { id: "webp-to-jpg", title: "WebP to JPG", description: "Convert modern WebP pictures into universal JPG images.", url: "/format-converter?from=webp&to=jpg", category: "image", tags: ["webp", "jpg"], iconName: "RefreshCw" },
  { id: "webp-to-png", title: "WebP to PNG", description: "Convert WebP images into transparent lossless PNG format.", url: "/format-converter?from=webp&to=png", category: "image", tags: ["webp", "png"], iconName: "RefreshCw" },
  { id: "jpg-to-png", title: "JPG to PNG", description: "Convert compressed JPG photos into lossless PNG files.", url: "/format-converter?from=jpg&to=png", category: "image", tags: ["jpg", "png"], iconName: "RefreshCw" },
  { id: "png-to-jpg", title: "PNG to JPG", description: "Compress heavy PNG images into lightweight JPG pictures.", url: "/format-converter?from=png&to=jpg", category: "image", tags: ["png", "jpg"], iconName: "RefreshCw" },
  { id: "avif-to-jpg", title: "AVIF to JPG", description: "Convert high-efficiency AVIF photos to standard JPG images.", url: "/format-converter?from=avif&to=jpg", category: "image", tags: ["avif", "jpg"], iconName: "RefreshCw" },
  { id: "avif-to-png", title: "AVIF to PNG", description: "Convert AVIF images into PNG preserving alpha transparency.", url: "/format-converter?from=avif&to=png", category: "image", tags: ["avif", "png"], iconName: "RefreshCw" },
  { id: "heic-to-png", title: "HEIC to PNG", description: "Extract Apple HEIC files as high-quality transparent PNG.", url: "/heic-to-jpg?to=png", category: "image", tags: ["heic", "png", "apple"], iconName: "Smartphone" },
  { id: "png-to-webp", title: "PNG to WebP", description: "Convert PNG graphics into ultra-small WebP images for the web.", url: "/format-converter?from=png&to=webp", category: "image", tags: ["png", "webp"], iconName: "RefreshCw" },
  { id: "webp-to-svg", title: "WebP to SVG", description: "Vectorize WebP images into scalable SVG code.", url: "/png-to-svg", category: "image", tags: ["webp", "svg"], iconName: "Vector" },
  { id: "web-to-png", title: "Web to PNG", description: "Capture responsive full-page website screenshots as PNG.", url: "/html-to-pdf", category: "image", tags: ["screenshot", "web", "png"], iconName: "Monitor" },
  { id: "odf-to-jpg", title: "ODF to JPG", description: "Convert Open Document format files into JPG images.", url: "/format-converter", category: "image", tags: ["odf", "odt", "jpg"], iconName: "FileImage" },
  { id: "odf-to-png", title: "ODF to PNG", description: "Convert Open Document slides and texts into PNG graphics.", url: "/format-converter", category: "image", tags: ["odf", "odt", "png"], iconName: "FileImage" },
  { id: "illustrator-to-png", title: "Illustrator to PNG", description: "Preview and export Adobe Illustrator (.ai) vector files as PNG.", url: "/svg-to-png", category: "image", tags: ["ai", "illustrator", "vector", "png"], iconName: "Palette" },
  { id: "jpeg-to-png", title: "JPEG to PNG", description: "Universal JPEG to lossless PNG converter.", url: "/format-converter?from=jpeg&to=png", category: "image", tags: ["jpeg", "png"], iconName: "RefreshCw" },
  { id: "pdf-image-extractor", title: "PDF Image Extractor", description: "Extract and download every raw embedded image inside a PDF.", url: "/pdf-to-img", category: "image", tags: ["extract", "images", "embedded"], iconName: "ImageDown" },

  // ==========================================
  // 3. CONVERTERS & DEV TOOLS (29)
  // ==========================================
  { id: "json-validator", title: "JSON Validator & Formatter", description: "Validate syntax, pinpoint errors, beautify, and minify JSON code.", url: "/json-validator", category: "converter", tags: ["json", "validate", "format", "beautify", "minify"], iconName: "Code", badge: "Popular" },
  { id: "base64-encoder", title: "Base64 Encoder / Decoder", description: "Encode text and files to Base64 or decode Base64 back to raw data.", url: "/base64-encoder", category: "converter", tags: ["base64", "encode", "decode", "binary"], iconName: "Binary" },
  { id: "regex-tester", title: "Regex Tester & Visualizer", description: "Test JavaScript regular expressions with real-time capture groups.", url: "/regex-tester", category: "converter", tags: ["regex", "regexp", "pattern", "matcher"], iconName: "SearchCode", badge: "Pro" },
  { id: "jwt-decoder", title: "JWT Token Decoder", description: "Inspect JSON Web Token headers, payload claims, and expiration dates.", url: "/jwt-decoder", category: "converter", tags: ["jwt", "token", "auth", "decoder"], iconName: "KeyRound" },
  { id: "uuid-generator", title: "UUID / GUID Generator", description: "Generate v4, v1, and v7 UUIDs in single or bulk batches.", url: "/uuid-generator", category: "converter", tags: ["uuid", "guid", "id", "random"], iconName: "Fingerprint" },
  { id: "password-generator", title: "Password Generator", description: "Generate strong cryptographic passwords with custom entropy rules.", url: "/password-generator", category: "converter", tags: ["password", "security", "random"], iconName: "ShieldAlert" },
  { id: "csv-to-json", title: "CSV ↔ JSON Converter", description: "Convert spreadsheet CSV tabular data to structured JSON and back.", url: "/csv-to-json", category: "converter", tags: ["csv", "json", "convert", "table"], iconName: "FileSpreadsheet" },
  { id: "sql-formatter", title: "SQL Formatter & Beautifier", description: "Beautify and indent SQL queries across MySQL, Postgres, and SQLite.", url: "/sql-formatter", category: "converter", tags: ["sql", "format", "query", "database"], iconName: "Database" },
  { id: "url-encoder", title: "URL Encoder / Decoder", description: "Safely encode and decode special characters in URL strings.", url: "/url-encoder", category: "converter", tags: ["url", "encode", "decode", "uri"], iconName: "Link" },
  { id: "quick-text-formatter", title: "Text Case Formatter", description: "Convert uppercase, lowercase, camelCase, kebab-case, and title case.", url: "/quick-text-formatter", category: "converter", tags: ["case", "uppercase", "lowercase", "slug"], iconName: "Type" },
  { id: "color-code-converter", title: "Color Code Converter", description: "Convert color values seamlessly between HEX, RGB, HSL, and HSV.", url: "/color-code-converter", category: "converter", tags: ["color", "hex", "rgb", "hsl"], iconName: "Palette" },
  { id: "text-replacement-tool", title: "Find & Replace Text", description: "Perform multi-line text find, regex replacements, and diff inspections.", url: "/text-replacement-tool", category: "converter", tags: ["replace", "find", "diff", "text"], iconName: "Replace" },
  { id: "zip-extractor", title: "ZIP Extractor", description: "Unpack and download contents from ZIP archives right in your browser.", url: "/zip-extractor", category: "converter", tags: ["zip", "unzip", "archive", "extract"], iconName: "FolderArchive" },
  { id: "morse-code-translator", title: "Morse Code Translator", description: "Convert text to Morse code signals and audio beeps and back.", url: "/morse-code-translator", category: "converter", tags: ["morse", "code", "telegraph"], iconName: "Radio" },
  { id: "binary-to-text-translator", title: "Binary to Text Translator", description: "Translate 0101 binary code streams into readable ASCII text.", url: "/binary-to-text-translator", category: "converter", tags: ["binary", "ascii", "decode"], iconName: "Binary" },
  { id: "currency-converter", title: "Currency Converter", description: "Calculate live conversion rates across 160+ world currencies.", url: "/currency-converter", category: "converter", tags: ["currency", "money", "forex", "usd", "eur"], iconName: "Coins" },
  { id: "time-zone-converter", title: "Time Zone Converter", description: "Compare meeting times and clocks across global time zones.", url: "/time-zone-converter", category: "converter", tags: ["time", "timezone", "clock", "world"], iconName: "Clock" },
  { id: "numbers-to-words", title: "Numbers to Words", description: "Spell out numbers into complete English words for checks and contracts.", url: "/numbers-to-words", category: "converter", tags: ["numbers", "words", "cheque", "spell"], iconName: "FileDigit" },
  { id: "roman-numerals-converter", title: "Roman Numerals Converter", description: "Convert standard numbers to Roman numerals (e.g. MMXXIV) and back.", url: "/roman-numerals-converter", category: "converter", tags: ["roman", "numerals", "math"], iconName: "Columns3" },
  { id: "ascii-generator", title: "ASCII Art Generator", description: "Transform simple text into big stylish ASCII banner art.", url: "/ascii-generator", category: "converter", tags: ["ascii", "banner", "text", "art"], iconName: "Terminal" },
  { id: "braille-translator", title: "Braille Translator", description: "Translate regular text into Braille tactile unicode characters.", url: "/braille-translator", category: "converter", tags: ["braille", "unicode", "accessibility"], iconName: "Grid2X2" },
  { id: "leetspeak-translator", title: "Leetspeak (1337) Translator", description: "Convert plain sentences into elite hacker leetspeak strings.", url: "/leetspeak-translator", category: "converter", tags: ["leet", "1337", "hacker"], iconName: "Cpu" },
  { id: "wingdings-translator", title: "Wingdings Translator", description: "Translate normal letters into classic Wingdings symbol characters.", url: "/wingdings-translator", category: "converter", tags: ["wingdings", "font", "symbols"], iconName: "Sparkle" },
  { id: "glitch-text-generator", title: "Glitch / Zalgo Text Generator", description: "Add spooky corrupted Zalgo glitch marks across any text.", url: "/glitch-text-generator", category: "converter", tags: ["glitch", "zalgo", "text"], iconName: "Activity" },
  { id: "invisible-character-generator", title: "Invisible Character Generator", description: "Copy blank invisible zero-width spaces and empty characters.", url: "/invisible-character-generator", category: "converter", tags: ["invisible", "zero-width", "blank"], iconName: "Ghost" },
  { id: "unicode-text-generator", title: "Unicode Fancy Font Generator", description: "Generate stylish bold, script, and gothic fonts for social media.", url: "/unicode-text-generator", category: "converter", tags: ["unicode", "fancy", "font", "instagram"], iconName: "Wand2" },
  { id: "youtube-thumbnail-downloader", title: "YouTube Thumbnail Downloader", description: "Grab full HD (1080p) cover thumbnails from any YouTube link.", url: "/youtube-thumbnail-downloader", category: "converter", tags: ["youtube", "thumbnail", "download"], iconName: "Video" },
  { id: "url-breakpoint-preview", title: "URL Breakpoint Preview", description: "Simulate mobile, tablet, and desktop iframe views for any URL.", url: "/url-breakpoint-preview", category: "converter", tags: ["responsive", "breakpoint", "preview", "mobile"], iconName: "Smartphone" },
  { id: "date-to-age-converter", title: "Date to Age Calculator", description: "Calculate exact age down to years, months, days, and seconds.", url: "/date-to-age-converter", category: "converter", tags: ["age", "birthday", "date"], iconName: "Calendar" },

  // ==========================================
  // 4. CALCULATORS & UNIT CONVERTERS (42)
  // ==========================================
  { id: "mortgage-calculator", title: "Mortgage Calculator", description: "Compute monthly mortgage payments, total interest, and amortization.", url: "/mortgage-calculator", category: "calculator", tags: ["mortgage", "loan", "home", "interest", "finance"], iconName: "Home", badge: "Popular" },
  { id: "salary-calculator", title: "Salary Calculator", description: "Convert hourly pay to weekly, monthly, and annual earnings.", url: "/salary-calculator", category: "calculator", tags: ["salary", "hourly", "wage", "pay"], iconName: "DollarSign", badge: "Popular" },
  { id: "paycheck-calculator", title: "Paycheck Calculator", description: "Estimate take-home paycheck after federal, FICA, and state tax deductions.", url: "/paycheck-calculator", category: "calculator", tags: ["paycheck", "tax", "withholding", "net"], iconName: "Receipt" },
  { id: "sales-tax-calculator", title: "Sales Tax Calculator", description: "Add sales tax to an item or reverse-calculate the pre-tax base cost.", url: "/sales-tax-calculator", category: "calculator", tags: ["tax", "sales", "vat", "reverse"], iconName: "Percent" },
  { id: "loan-calculator", title: "Loan & EMI Calculator", description: "Calculate monthly payments and total interest for personal or auto loans.", url: "/loan-calculator", category: "calculator", tags: ["loan", "emi", "interest", "credit"], iconName: "CreditCard" },
  { id: "investment-calculator", title: "Compound Interest Calculator", description: "Project investment compound growth and returns over years.", url: "/investment-calculator", category: "calculator", tags: ["investment", "compound", "interest", "growth"], iconName: "TrendingUp" },
  { id: "retirement-calculator", title: "Retirement Calculator", description: "Estimate retirement nest egg requirements using the 4% rule.", url: "/retirement-calculator", category: "calculator", tags: ["retirement", "pension", "fire", "savings"], iconName: "PiggyBank" },
  { id: "profit-margin-calculator", title: "Profit Margin & Markup", description: "Calculate gross margin percentage, markup rate, and net profit.", url: "/profit-margin-calculator", category: "calculator", tags: ["margin", "markup", "profit", "business"], iconName: "BadgeDollarSign" },
  { id: "roi-calculator", title: "ROI Calculator", description: "Measure total and annualized return on investment percentage.", url: "/roi-calculator", category: "calculator", tags: ["roi", "return", "investment"], iconName: "CircleDollarSign" },
  { id: "commission-calculator", title: "Commission Calculator", description: "Calculate tiered sales commissions and broker compensation splits.", url: "/commission-calculator", category: "calculator", tags: ["commission", "sales", "bonus"], iconName: "Briefcase" },
  { id: "discount-calculator", title: "Discount Calculator", description: "Calculate discounted sale prices and total savings percentage.", url: "/discount-calculator", category: "calculator", tags: ["discount", "sale", "percentage", "savings"], iconName: "Tag" },
  { id: "percentage-calculator", title: "Percentage Calculator", description: "Rapid percentage increase, decrease, difference, and proportion tool.", url: "/percentage-calculator", category: "calculator", tags: ["percentage", "math", "ratio"], iconName: "Percent" },

  // Health & Daily Calculators
  { id: "bmi-calculator", title: "BMI Calculator", description: "Calculate Body Mass Index and healthy weight category range.", url: "/bmi-calculator", category: "calculator", tags: ["bmi", "health", "weight", "fitness"], iconName: "HeartPulse", badge: "Popular" },
  { id: "calorie-calculator", title: "Calorie & TDEE Calculator", description: "Determine basal metabolic rate and daily calorie needs for fitness goals.", url: "/calorie-calculator", category: "calculator", tags: ["calorie", "tdee", "bmr", "diet"], iconName: "Flame" },
  { id: "due-date-calculator", title: "Pregnancy Due Date Calculator", description: "Estimate delivery date based on last period or conception date.", url: "/due-date-calculator", category: "calculator", tags: ["pregnancy", "baby", "due-date"], iconName: "Baby" },
  { id: "gpa-calculator", title: "GPA Calculator", description: "Calculate cumulative high school or college grade point averages.", url: "/gpa-calculator", category: "calculator", tags: ["gpa", "grades", "college", "school"], iconName: "GraduationCap" },
  { id: "tip-calculator", title: "Tip & Bill Splitter", description: "Calculate tip percentages and evenly divide restaurant bills.", url: "/tip-calculator", category: "calculator", tags: ["tip", "bill", "restaurant", "split"], iconName: "Utensils" },
  { id: "word-counter", title: "Word & Character Counter", description: "Instant counts for words, characters, sentences, paragraphs, and reading time.", url: "/word-counter", category: "calculator", tags: ["word", "character", "counter", "reading"], iconName: "FileText" },
  { id: "countdown-timer", title: "Countdown Timer & Stopwatch", description: "Custom interval timer and digital stopwatch with audible alarms.", url: "/countdown-timer", category: "calculator", tags: ["timer", "stopwatch", "alarm", "clock"], iconName: "Timer" },
  { id: "days-until-calculator", title: "Days Until Calculator", description: "Count how many days, hours, and minutes remain until a target event.", url: "/days-until-calculator", category: "calculator", tags: ["countdown", "days", "calendar", "event"], iconName: "CalendarClock" },
  { id: "random-number-generator", title: "Random Number Generator", description: "Generate provably fair random numbers, coin flips, and dice rolls.", url: "/random-number-generator", category: "calculator", tags: ["random", "dice", "number", "rng"], iconName: "Dices" },
  { id: "fraction-calculator", title: "Fraction Calculator", description: "Add, subtract, multiply, and simplify mathematical fractions.", url: "/fraction-calculator", category: "calculator", tags: ["fraction", "math", "division"], iconName: "Divide" },
  { id: "word-unscrambler", title: "Word Unscrambler / Anagrams", description: "Find valid dictionary words from scrambled letters and Scrabble tiles.", url: "/word-unscrambler", category: "calculator", tags: ["anagram", "scrabble", "unscramble", "wordle"], iconName: "SpellCheck" },

  // Unit Converters Suite
  { id: "unit-converter", title: "Universal Unit Converter", description: "Comprehensive converter for length, temperature, weight, volume, and time.", url: "/unit-converter", category: "calculator", tags: ["units", "metric", "imperial", "convert"], iconName: "Scale", badge: "Pro" },
  { id: "celsius-to-fahrenheit", title: "Celsius ↔ Fahrenheit", description: "Convert temperatures between Celsius, Fahrenheit, and Kelvin.", url: "/unit-converter?category=temperature", category: "calculator", tags: ["temperature", "celsius", "fahrenheit"], iconName: "Thermometer" },
  { id: "miles-to-km", title: "Miles ↔ Kilometers", description: "Convert distance between imperial miles and metric kilometers.", url: "/unit-converter?category=length&from=miles&to=km", category: "calculator", tags: ["miles", "km", "distance"], iconName: "Milestone" },
  { id: "feet-to-meter", title: "Feet ↔ Meters", description: "Convert height and distance between feet and meters.", url: "/unit-converter?category=length&from=feet&to=meter", category: "calculator", tags: ["feet", "meter", "height"], iconName: "Ruler" },
  { id: "inch-to-cm", title: "Inches ↔ Centimeters", description: "Convert small lengths between inches and centimeters.", url: "/unit-converter?category=length&from=inch&to=cm", category: "calculator", tags: ["inch", "cm", "measure"], iconName: "Ruler" },
  { id: "foot-to-inch", title: "Feet ↔ Inches", description: "Convert between feet and total inch length.", url: "/unit-converter?category=length&from=feet&to=inch", category: "calculator", tags: ["feet", "inches"], iconName: "Ruler" },
  { id: "lbs-to-kg", title: "Pounds (lbs) ↔ Kilograms (kg)", description: "Convert weight between imperial pounds and metric kilograms.", url: "/unit-converter?category=weight&from=lbs&to=kg", category: "calculator", tags: ["weight", "lbs", "kg", "pounds"], iconName: "Scale" },
  { id: "ounces-to-grams", title: "Ounces ↔ Grams", description: "Convert cooking and kitchen measurements between ounces and grams.", url: "/unit-converter?category=weight&from=oz&to=grams", category: "calculator", tags: ["oz", "grams", "cooking"], iconName: "Scale" },
  { id: "liters-to-gallons", title: "Liters ↔ Gallons", description: "Convert volume between liters and US/UK gallons.", url: "/unit-converter?category=volume&from=liters&to=gallons", category: "calculator", tags: ["liters", "gallons", "volume"], iconName: "Droplet" },
  { id: "ml-to-oz", title: "Milliliters (ml) ↔ Fluid Ounces (fl oz)", description: "Convert liquid volume between milliliters and fluid ounces.", url: "/unit-converter?category=volume&from=ml&to=floz", category: "calculator", tags: ["ml", "oz", "liquid"], iconName: "GlassWater" },
  { id: "hours-to-minutes", title: "Hours ↔ Minutes ↔ Seconds", description: "Time unit conversions across hours, minutes, and seconds.", url: "/unit-converter?category=time", category: "calculator", tags: ["hours", "minutes", "time"], iconName: "Clock" },
  { id: "cm-to-m", title: "CM ↔ Meters", description: "Convert centimeters into meters and millimeters.", url: "/unit-converter?category=length&from=cm&to=meter", category: "calculator", tags: ["cm", "meter"], iconName: "Ruler" },
  { id: "feet-to-cm", title: "Feet ↔ CM", description: "Convert height between feet and centimeters.", url: "/unit-converter?category=length&from=feet&to=cm", category: "calculator", tags: ["feet", "cm"], iconName: "Ruler" },
  { id: "feet-to-miles", title: "Feet ↔ Miles", description: "Convert distance between feet and miles.", url: "/unit-converter?category=length&from=feet&to=miles", category: "calculator", tags: ["feet", "miles"], iconName: "Milestone" },
  { id: "inch-to-mm", title: "Inches ↔ Millimeters", description: "Convert precision measurements between inches and millimeters.", url: "/unit-converter?category=length&from=inch&to=mm", category: "calculator", tags: ["inch", "mm"], iconName: "Ruler" },
  { id: "inches-to-feet", title: "Inches ↔ Feet", description: "Convert total inches to feet.", url: "/unit-converter?category=length&from=inch&to=feet", category: "calculator", tags: ["inches", "feet"], iconName: "Ruler" },
  { id: "km-to-miles", title: "KM ↔ Miles", description: "Convert metric kilometers to miles.", url: "/unit-converter?category=length&from=km&to=miles", category: "calculator", tags: ["km", "miles"], iconName: "Milestone" },
  { id: "meter-to-inch", title: "Meters ↔ Inches", description: "Convert meters to inches.", url: "/unit-converter?category=length&from=meter&to=inch", category: "calculator", tags: ["meter", "inches"], iconName: "Ruler" },
  { id: "meters-to-miles", title: "Meters ↔ Miles", description: "Convert meters to miles.", url: "/unit-converter?category=length&from=meter&to=miles", category: "calculator", tags: ["meters", "miles"], iconName: "Milestone" },

  // ==========================================
  // 5. MARKETING & BUSINESS TOOLS (12)
  // ==========================================
  { id: "invoice-generator", title: "Invoice Generator", description: "Build professional itemized invoices with tax, discounts, and PDF download.", url: "/invoice-generator", category: "marketing", tags: ["invoice", "billing", "pdf", "freelance"], iconName: "FileSpreadsheet", badge: "Popular" },
  { id: "receipt-generator", title: "Receipt Generator", description: "Create customized proof-of-payment receipts with stamped 'PAID' badges.", url: "/receipt-generator", category: "marketing", tags: ["receipt", "paid", "payment", "pdf"], iconName: "Receipt", badge: "Popular" },
  { id: "pay-stub-generator", title: "Pay Stub Generator", description: "Generate payroll earning statements with salary and withholding breakdown.", url: "/pay-stub-generator", category: "marketing", tags: ["paystub", "payroll", "earnings", "pdf"], iconName: "Banknote", badge: "Pro" },
  { id: "resume-builder", title: "Resume Builder", description: "Create clean single-page ATS-optimized resumes with instant A4 PDF export.", url: "/resume-builder", category: "marketing", tags: ["resume", "cv", "job", "ats", "pdf"], iconName: "FileBadge", badge: "Popular" },
  { id: "barcode-generator", title: "Barcode Generator", description: "Generate Code 128, EAN-13, and UPC barcodes to download as PNG/SVG.", url: "/barcode-generator", category: "marketing", tags: ["barcode", "upc", "ean", "retail"], iconName: "Barcode" },
  { id: "qr-code-generator", title: "QR Code Generator", description: "Generate customized high-res QR codes for URLs, Wi-Fi, and text.", url: "/qr-code-generator", category: "marketing", tags: ["qr", "qrcode", "scan"], iconName: "QrCode", badge: "Popular" },
  { id: "pomodoro-timer", title: "Pomodoro Focus Timer", description: "25-minute productivity timer with short/long breaks and browser chimes.", url: "/pomodoro-timer", category: "marketing", tags: ["pomodoro", "timer", "focus", "productivity"], iconName: "Hourglass" },
  { id: "email-signature-generator", title: "Email Signature Generator", description: "Design clickable HTML email signatures for Gmail, Outlook, and Apple Mail.", url: "/email-signature-generator", category: "marketing", tags: ["email", "signature", "html", "branding"], iconName: "Mail" },
  { id: "tweet-previewer", title: "Tweet & Social Previewer", description: "Preview how your posts, cards, and tweets render before publishing.", url: "/tweet-previewer", category: "marketing", tags: ["tweet", "twitter", "x", "preview"], iconName: "Twitter" },
  { id: "og-previewer", title: "Open Graph (OG) Previewer", description: "Test how a website link looks when shared on Twitter, Facebook, and LinkedIn.", url: "/og-previewer", category: "marketing", tags: ["og", "opengraph", "meta", "seo"], iconName: "Share2" },
  { id: "email-subject-line-preview", title: "Subject Line Previewer", description: "Test email subject lines across mobile, desktop, and dark-mode inboxes.", url: "/email-subject-line-preview", category: "marketing", tags: ["email", "subject", "newsletter"], iconName: "Inbox" },
  { id: "url-shortener", title: "Clean Link Shortener", description: "Create short shareable links and clean tracking parameters from URLs.", url: "/url-shortener", category: "marketing", tags: ["link", "shortener", "cleaner"], iconName: "Link2" },

  // ==========================================
  // 6. DESIGN & WEB FUN TOOLS (15)
  // ==========================================
  { id: "css-gradient-generator", title: "CSS Gradient Generator", description: "Build linear, radial, and conic CSS gradients with live preview & copy.", url: "/css-gradient-generator", category: "fun", tags: ["css", "gradient", "design", "tailwind"], iconName: "Palette", badge: "Popular" },
  { id: "glassmorphism-css-generator", title: "Glassmorphism Generator", description: "Tune blur, opacity, border, and specular highlight to generate glass CSS.", url: "/glassmorphism-css-generator", category: "fun", tags: ["glass", "glassmorphism", "css", "blur"], iconName: "Sparkles", badge: "Pro" },
  { id: "box-shadow-generator", title: "CSS Box Shadow Generator", description: "Visual multi-layer elevation and shadow generator with CSS export.", url: "/box-shadow-generator", category: "fun", tags: ["shadow", "box-shadow", "css"], iconName: "Layers" },
  { id: "mesh-gradient-generator", title: "Mesh Gradient Generator", description: "Generate organic multi-color mesh gradient backgrounds and PNG exports.", url: "/mesh-gradient-generator", category: "fun", tags: ["mesh", "gradient", "wallpaper", "png"], iconName: "Shapes" },
  { id: "color-palette-generator", title: "Color Palette Generator", description: "Generate complementary, monochromatic, and analogous hex color schemes.", url: "/color-palette-generator", category: "fun", tags: ["palette", "colors", "harmony"], iconName: "Palette" },
  { id: "lorem-ipsum-generator", title: "Lorem Ipsum Generator", description: "Generate placeholder text by paragraph, word count, or list item.", url: "/lorem-ipsum-generator", category: "fun", tags: ["lorem", "ipsum", "dummy", "text"], iconName: "FileText" },
  { id: "2048", title: "2048 Game", description: "Slide tiles, combine numbers, and try to reach the legendary 2048 tile.", url: "/2048", category: "fun", tags: ["game", "2048", "puzzle", "fun"], iconName: "Gamepad2", badge: "Popular" },
  { id: "typewriter", title: "Vintage Typewriter Simulator", description: "Type with authentic mechanical key clatter sounds and margin bells.", url: "/typewriter", category: "fun", tags: ["typewriter", "vintage", "sound", "retro"], iconName: "Keyboard" },
  { id: "hacker-typer", title: "Hacker Typer Simulator", description: "Mash random keys to display authentic green Matrix hacker terminal code.", url: "/hacker-typer", category: "fun", tags: ["hacker", "matrix", "terminal", "green"], iconName: "Terminal" },
  { id: "tab-audio-recorder", title: "Tab Audio Recorder", description: "Record internal system and tab audio and export as high-quality WAV/MP3.", url: "/tab-audio-recorder", category: "fun", tags: ["audio", "record", "tab", "sound"], iconName: "Mic" },
  { id: "mocking-spongebob-text", title: "Mocking SpongeBob Text", description: "tUrN aNy tExT iNtO tHiS mOcKiNg cAsE sTyLe in one click.", url: "/mocking-spongebob-text", category: "fun", tags: ["spongebob", "meme", "text"], iconName: "Laugh" },
  { id: "upside-down-text", title: "Upside Down Text Flipper", description: "Flip text uʍop ǝpᴉsdn automatically using unicode symbols.", url: "/upside-down-text", category: "fun", tags: ["upside-down", "flip", "text"], iconName: "ArrowDownUp" },
  { id: "vaporwave-text", title: "Vaporwave Aesthetic Text", description: "Turn sentences into Ｗ Ｉ Ｄ Ｅ full-width vaporwave typography.", url: "/vaporwave-text", category: "fun", tags: ["vaporwave", "aesthetic", "wide"], iconName: "Music" },
  { id: "text-to-emoji", title: "Text to Emoji Translator", description: "Automatically replace common words with corresponding emoji icons.", url: "/text-to-emoji", category: "fun", tags: ["emoji", "translate", "fun"], iconName: "Smile" },
  { id: "tweet-mockup-generator", title: "Tweet Mockup Generator", description: "Create verified X/Twitter post screenshots with custom likes and replies.", url: "/tweet-previewer?mode=mockup", category: "fun", tags: ["tweet", "mockup", "twitter", "screenshot"], iconName: "Image" }
];
