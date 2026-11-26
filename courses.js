/* SSSEDUTECH — Courses, roadmaps, cart & checkout
   ------------------------------------------------------------------
   EDIT THE SETTINGS BELOW BEFORE GOING LIVE
   ------------------------------------------------------------------ */

const SITE = {
  // Paste your Razorpay Key ID here (starts with rzp_test_ or rzp_live_).
  // Leave empty to keep checkout in "WhatsApp order" mode (no online payment, no invoice).
  razorpayKey: "",
  // Lets you try the full flow (login -> form -> payment -> invoice) WITHOUT real money.
  // It is always ON when the page is opened from your own computer (localhost / file).
  // Keep it false on the live website.
  demoPayments: false,
  whatsapp: "919071021021",
  brand: "SSSEDUTECH SOLUTIONS",

  // Student accounts + saved invoices (free Firebase project). See SETUP-ACCOUNTS.md.
  // Leave apiKey empty to run in "this browser only" test mode.
  firebase: { apiKey: "", authDomain: "", projectId: "", appId: "" },

  // Printed on every invoice. Fill in the real details before going live.
  company: {
    legalName: "SSSEDUTECH SOLUTIONS",
    address: "Bengaluru, Karnataka, India",   // put the full registered address here
    state: "Karnataka",                        // decides CGST+SGST (same state) vs IGST
    gstin: "",                                 // your 15-character GSTIN; leave empty if not GST-registered
    email: "sssedutechsolutions@gmail.com",
    phone: "+91 90710 21021",
    website: "www.sssedutechsolutions.com",
    sac: "999293",                             // SAC for commercial training / coaching services
    invoicePrefix: "SSS"
  }
};

// PLACEHOLDER PRICES (INR) and durations — replace with your real fees.
// Default price/duration comes from the course level; use PRICE_OVERRIDE for one-offs.
const PRICE_BY_LEVEL    = { Certified: 15000, Masters: 30000, PG: 40000, Professional: 30000, Diploma: 45000, Program: 25000 };
const WEEKS_BY_LEVEL    = { Certified: 12,    Masters: 24,    PG: 32,    Professional: 24,    Diploma: 36,    Program: 16 };
// GST added on top of the course fee (placeholder rate; confirm with your accountant).
const GST_RATE = 0.18;
// Optional instalment plan shown on "Buy now": first payment is a % of the total, the balance is collected by your team.
const INSTALMENT = { enabled: true, firstPct: 50 };
const WEEKS_OVERRIDE    = { "Python Full Stack": 24, "Data Science": 28, "Data Analytics": 20, "AWS & DevOps": 24, "Cyber Security": 24 };
const PRICE_OVERRIDE    = {
  // "Masters in Python": 28000,
};

/* ---------- Course catalogue (categories → programs) ---------- */
const COURSES = [
  {cat:"IT", ico:"🖥️", items:[
    "Python Full Stack","Data Science","Data Analytics","AWS & DevOps","Cyber Security"
  ]},
  {cat:"Mechanical & Design", ico:"⚙️", items:[
    "Certified Product Design","Masters in Industrial Design","Masters in Automotive Design",
    "Certified in CAE","PG Program in Hybrid Vehicle Design & Analysis","Masters in R&D Design",
    "Certified in Wiring Harness Design","Certified CAM Programmer","Masters in CAD / CAM Engineer",
    "Professional Program in BIM Engineer","Professional Program in Architectural Design",
    "Certified Structural Design & Analysis","Certified Building Design","Certified Interior Design"
  ]},
  {cat:"Programming", ico:"💻", items:[
    "Certified in Python","Masters in Python","Certified in Java","Masters in Java",
    "Certified in PHP & Laravel","Certified in WordPress","Certified in .NET Developer",
    "Masters in .NET Developer","Certified in Android App Development","Certified in Flutter App Development",
    "Certified in Web Design & Development","Masters in Web Design & Development",
    "Certified in MEAN","Certified in MERN","Certified in Software Testing","Masters in Software Testing"
  ]},
  {cat:"Data Science", ico:"📊", items:[
    "Certified in Data Science","Masters in Data Science","Certified in Data Analytics","Certified in Business Analytics"
  ]},
  {cat:"UI / UX", ico:"🎨", items:["Certified in UI/UX","Masters in UI/UX"]},
  {cat:"Cloud", ico:"☁️", items:[
    "Certified in AWS","Masters in AWS & DevOps","Certified in Azure","Masters in Azure & DevOps"
  ]},
  {cat:"Networking", ico:"🌐", items:["Certified in Networking"]},
  {cat:"Digital Marketing", ico:"📣", items:["Certified in Digital Marketing","Masters in Digital Marketing"]},
  {cat:"Agile", ico:"🔄", items:["Certified in Scrum"]},
  {cat:"Automation", ico:"🤖", items:[
    "Certified in RPA","Certified in Industrial Automation","Masters in Industrial Automation",
    "Certified in Automation","Certified in Robotics"
  ]},
  {cat:"Embedded", ico:"🔌", items:[
    "Certified in Embedded System","Masters in Embedded System","Certified in IoT","Masters in IoT",
    "Certified in PCB","Masters in PCB","VLSI"
  ]},
  {cat:"Simulation", ico:"🧪", items:["Certified in Simulation Analysis","Masters in Simulation Analysis"]},
  {cat:"Automotive Embedded", ico:"🚗", items:["Diploma in Automotive Embedded & EV"]},
  {cat:"Electronics", ico:"⚡", items:[
    "Masters in LabVIEW","Certified in E3D","Certified in SP3D","Certified in PDMS",
    "Certified in MEP","Certified in HVAC","Certified in E-CAD","Masters in E-CAD"
  ]}
];

/* ---------- Roadmap library ----------
   Each phase is "Title::topic; topic; topic".
   Certified courses show the first 3 phases + a mini project.
   Masters / PG / Professional / Diploma show all phases + capstone + placement prep.
   DRAFT CONTENT — align with the Pumo Technovation syllabus before publishing. */
const R = {
python:[
 "Python foundations::Syntax, variables and data types; Conditions, loops and functions; Strings, lists, dictionaries and sets; File handling and error handling",
 "Object-oriented Python::Classes, inheritance and polymorphism; Modules, packages and virtual environments; Git and GitHub basics",
 "Python in practice::Calling REST APIs and handling JSON; SQL and SQLite databases; Automation scripts; Unit testing with pytest",
 "Web and data libraries::Flask or Django fundamentals; NumPy and Pandas; Charts with Matplotlib",
 "Advanced Python::Decorators, generators and async; Designing REST APIs; Docker and deployment basics; Coding interview problems"],
java:[
 "Core Java::Syntax, data types and control flow; OOP: classes, interfaces, inheritance; Exceptions and packages; Strings and arrays",
 "Collections and advanced Java::Collections framework and generics; Multithreading; Streams and lambdas; File I/O",
 "Database and web basics::JDBC and MySQL; Servlets and JSP; Maven and Git",
 "Spring Boot::Dependency injection and Spring MVC; REST APIs; Spring Data JPA and Hibernate; Authentication with Spring Security",
 "Enterprise Java::Microservices basics; Testing with JUnit and Mockito; Docker and deployment; Data structures and algorithms practice"],
php:[
 "PHP fundamentals::Syntax, arrays and functions; Forms and sessions; OOP in PHP; Composer",
 "Databases::MySQL design and queries; PDO and CRUD applications; Security: validation and SQL injection",
 "Laravel::Routing, controllers and Blade views; Eloquent ORM and migrations; Authentication and middleware; Building a full CRUD app",
 "APIs and integrations::REST APIs with Laravel; Payment gateway and email integration; File uploads",
 "Production Laravel::Queues, jobs and caching; Automated testing; Deployment to a live server"],
wordpress:[
 "WordPress essentials::Installing and configuring WordPress; Posts, pages and menus; Themes, plugins and the block editor",
 "Build real sites::Page builders such as Elementor; WooCommerce store setup; Forms, SEO and analytics plugins",
 "Customisation::HTML, CSS and child themes; PHP basics and WordPress hooks; Custom post types",
 "Performance and security::Speed optimisation and caching; Backups and security hardening; Hosting and domain setup",
 "Freelance ready::Client briefs and delivery workflow; Maintenance packages; Portfolio sites"],
dotnet:[
 "C# fundamentals::Syntax, types and control flow; OOP in C#; Collections and LINQ; Exceptions",
 "ASP.NET Core MVC::Controllers, views and routing; Razor and model binding; Dependency injection",
 "Data and APIs::SQL Server basics; Entity Framework Core; Building Web APIs",
 "Security and architecture::Identity and JWT authentication; Layered architecture; Unit testing with xUnit",
 "Deployment::Azure App Service and CI/CD; Microservices overview; Capstone application"],
android:[
 "Kotlin and Android basics::Kotlin syntax and OOP; Android Studio and project structure; Activities, fragments and navigation",
 "User interface::Layouts and Material components; Jetpack Compose basics; RecyclerView and lists",
 "Data and networking::Room database; Retrofit and JSON APIs; Shared preferences and DataStore",
 "App features::Firebase authentication and database; Notifications; Maps and location; Permissions",
 "Release::MVVM architecture; Testing and debugging; Publishing on the Play Store"],
flutter:[
 "Dart and Flutter basics::Dart syntax and OOP; Widgets and layouts; Navigation and forms",
 "State and data::State management with Provider or Bloc; REST APIs and JSON; Local storage",
 "Backend features::Firebase authentication and Firestore; Push notifications; Maps and device features",
 "Polish::Animations and theming; Responsive layouts; Testing and debugging",
 "Release::Play Store and App Store publishing; App performance; Capstone app"],
webdev:[
 "Web foundations::HTML5 and semantic markup; CSS, Flexbox and Grid; Responsive design",
 "JavaScript::ES6+ fundamentals; DOM and events; Fetch API and async code",
 "Frameworks::Bootstrap or Tailwind CSS; React basics: components, props, state; Routing",
 "Backend basics::Node.js and Express; REST APIs; MongoDB or MySQL",
 "Launch::Git and GitHub; Hosting and domains; Performance and SEO basics; Portfolio project"],
mean:[
 "JavaScript and TypeScript::ES6+ essentials; TypeScript basics; Git and npm",
 "Backend::Node.js and Express; REST API design; Authentication with JWT",
 "Database::MongoDB and Mongoose; Schema design; Aggregation basics",
 "Frontend::Angular components and modules; Services, routing and forms; Consuming APIs",
 "Deployment::Testing; Docker and cloud deployment; Full-stack capstone"],
mern:[
 "JavaScript essentials::ES6+ features; Async programming; Git and npm",
 "Backend::Node.js and Express; REST APIs; Authentication with JWT",
 "Database::MongoDB and Mongoose; Schema design; CRUD and aggregation",
 "React::Components, hooks and state; React Router; Redux or Context API; Connecting to APIs",
 "Deployment::Testing; Deploying to the cloud; Full-stack capstone"],
testing:[
 "Testing fundamentals::SDLC and STLC; Test case design techniques; Bug lifecycle and reporting",
 "Manual testing in practice::Test plans and test data; Jira and test management tools; Real project testing",
 "Automation::Selenium WebDriver; Java or Python for testers; TestNG or pytest",
 "API and database testing::Postman and REST API testing; SQL for testers; Framework design",
 "Advanced QA::CI/CD with Jenkins; Performance testing with JMeter; Mobile testing overview"],
datasci:[
 "Foundations::Python for data; Statistics and probability; Linear algebra basics",
 "Data handling::NumPy and Pandas; SQL; Data cleaning and exploratory analysis; Visualisation",
 "Machine learning::Regression and classification; Clustering and dimensionality reduction; Model evaluation with scikit-learn; Feature engineering",
 "Deep learning and NLP::Neural networks with TensorFlow or PyTorch; Text processing and NLP basics; Computer vision overview",
 "Deployment::Model serving with Flask or FastAPI; Intro to MLOps; End-to-end project"],
analytics:[
 "Spreadsheet and SQL::Advanced Excel; SQL queries and joins; Data cleaning",
 "Statistics and Python::Descriptive and inferential statistics; Python with Pandas; Visualisation",
 "Business intelligence::Power BI or Tableau dashboards; KPIs and reporting; Data modelling",
 "Applied analytics::A/B testing; Forecasting basics; Case studies",
 "Career prep::Analytics storytelling; Portfolio dashboards; Interview preparation"],
bizanalytics:[
 "Business foundations::Business metrics and KPIs; Marketing, sales and finance basics; Problem framing",
 "Data tools::Advanced Excel; SQL for analysts; Data cleaning",
 "Dashboards::Power BI or Tableau; Data storytelling; Automated reporting",
 "Decision analytics::Forecasting; Customer and revenue analysis; Case studies",
 "Career prep::Business case presentations; Portfolio; Interview preparation"],
uiux:[
 "Design fundamentals::Design principles, colour and typography; Layout and grids; Accessibility basics",
 "UX research::User interviews and surveys; Personas and journey maps; Information architecture",
 "Wireframing and prototyping::Low and high fidelity wireframes; Figma components and auto layout; Interactive prototypes",
 "Design systems and testing::Building a design system; Usability testing; Developer handoff",
 "Portfolio::Two end-to-end case studies; Presenting design decisions; Interview preparation"],
aws:[
 "Cloud fundamentals::Cloud concepts and the AWS global infrastructure; IAM users, roles and policies; Billing and cost control",
 "Core services::EC2, EBS and AMIs; S3 and storage classes; VPC, subnets and security groups; RDS and DynamoDB",
 "Scale and secure::Load balancing and auto scaling; Route 53 and CloudFront; CloudWatch monitoring; Serverless with Lambda",
 "DevOps toolchain::Linux and shell scripting; Git and CI/CD with Jenkins or GitHub Actions; Docker containers",
 "Infrastructure at scale::Kubernetes and EKS; Terraform infrastructure as code; Monitoring and logging; AWS certification preparation"],
azure:[
 "Cloud fundamentals::Cloud concepts and Azure architecture; Azure AD and role-based access; Subscriptions and cost management",
 "Core services::Virtual machines and storage; Virtual networks and security groups; Azure SQL and Cosmos DB",
 "Scale and secure::Load balancer and scale sets; App Service and Functions; Azure Monitor",
 "DevOps toolchain::Linux and shell scripting; Git and Azure DevOps pipelines; Docker containers",
 "Infrastructure at scale::Kubernetes and AKS; Terraform or Bicep; Monitoring and logging; Azure certification preparation"],
networking:[
 "Network fundamentals::OSI and TCP/IP models; IP addressing and subnetting; Ethernet and cabling",
 "Switching and routing::VLANs and trunking; Spanning Tree; Static routing, RIP, EIGRP and OSPF",
 "Services and security::DHCP, DNS and NAT; Access control lists; Firewalls and VPNs",
 "Wireless and troubleshooting::WLAN basics; Network monitoring and troubleshooting; Packet analysis",
 "Certification prep::CCNA-style labs; Mock tests; Interview preparation"],
digitalmarketing:[
 "Marketing foundations::Digital marketing strategy; Audience research; Content planning",
 "SEO and content::On-page, off-page and technical SEO; Keyword research; Blogging and content marketing",
 "Social and paid media::Social media marketing; Google Ads search and display; Meta Ads campaigns",
 "Analytics and automation::Google Analytics and Search Console; Email marketing; Marketing automation tools",
 "Career ready::Live campaigns; Freelancing and agency workflow; Portfolio and interview preparation"],
scrum:[
 "Agile foundations::Agile values and principles; Agile vs waterfall; Lean and Kanban basics",
 "Scrum framework::Roles, events and artifacts; Sprint planning and reviews; Definition of done",
 "Backlog and estimation::Writing user stories; Estimation and velocity; Prioritisation",
 "Tools and scaling::Jira boards and reports; Scaling frameworks overview; Metrics",
 "Certification prep::Scrum exam preparation; Mock tests; Interview questions"],
rpa:[
 "RPA fundamentals::What RPA is and where it fits; Process analysis; UiPath Studio basics",
 "Building bots::Variables, control flow and selectors; Excel, email and PDF automation; Error handling",
 "Advanced automation::Web and desktop automation; Working with APIs and databases; Reusable components",
 "Deployment::Orchestrator, queues and scheduling; Bot logging and maintenance; Best practices",
 "Project::End-to-end automation project; Certification preparation"],
indauto:[
 "Control fundamentals::Electrical basics; Sensors and actuators; Relay and contactor logic",
 "PLC programming::PLC architecture; Ladder logic; Timers, counters and analog handling",
 "HMI and SCADA::HMI screen design; SCADA basics; Alarms and trends",
 "Drives and networks::VFDs and servo basics; Modbus, Profibus and Profinet; Panel wiring",
 "Industrial project::Process automation project; Troubleshooting; Safety standards"],
automation:[
 "Automation fundamentals::Types of automation; Sensors and controllers; Workflow thinking",
 "Scripting::Python for automation; Working with files and APIs; Scheduling tasks",
 "Tools::Process automation tools; Test automation overview; PLC overview",
 "Integration::APIs and webhooks; Databases; Notifications and reporting",
 "Project::End-to-end automation project; Documentation; Presentation"],
robotics:[
 "Robotics fundamentals::Kinematics and robot types; Sensors and actuators; Motors and drivers",
 "Embedded control::Arduino and microcontrollers; Motor and servo control; Sensor interfacing",
 "Software for robots::Python for robotics; ROS basics; Simulation with Gazebo",
 "Perception and navigation::Computer vision with OpenCV; Path planning; Localisation",
 "Project::Build and program a working robot; Testing; Demo and documentation"],
embedded:[
 "Embedded C::C programming essentials; Pointers and memory; Bitwise operations",
 "Microcontrollers::8051 and ARM Cortex-M architecture; GPIO, timers and interrupts; ADC and PWM",
 "Communication protocols::UART, I2C and SPI; CAN basics; Sensor and display interfacing",
 "RTOS and Linux::RTOS concepts with FreeRTOS; Task scheduling and synchronisation; Embedded Linux overview",
 "Product development::Debugging with JTAG; Low-power design; Capstone embedded product"],
iot:[
 "IoT fundamentals::IoT architecture; Sensors and actuators; Electronics basics",
 "Microcontrollers::Arduino and ESP32; Reading sensors; Controlling devices",
 "Connectivity::Wi-Fi, Bluetooth and LoRa; MQTT and HTTP; Gateways",
 "Cloud and dashboards::IoT cloud platforms; Dashboards and alerts; Data storage",
 "Security and deployment::Device security; OTA updates; Capstone IoT solution"],
pcb:[
 "Electronics basics::Components and datasheets; Circuit analysis; Power supply design",
 "Schematic design::Schematic capture; Component libraries; Design rule checks",
 "PCB layout::Footprints and placement; Routing and layer stack-up; Power and ground planes",
 "Advanced layout::High-speed and signal integrity basics; EMI and EMC; Design for manufacturing",
 "Fabrication::Gerber and fabrication outputs; Assembly and testing; Capstone board"],
vlsi:[
 "Digital fundamentals::Number systems and Boolean algebra; Combinational and sequential logic; FSM design",
 "Verilog HDL::Modelling styles; Testbenches; Simulation",
 "RTL and FPGA::RTL design practices; Synthesis and timing; FPGA implementation",
 "Verification::SystemVerilog basics; Verification environments; Coverage and assertions",
 "Physical design overview::ASIC flow; Floorplanning and place and route; Project"],
simulation:[
 "Engineering foundations::Mechanics of materials; Heat transfer basics; Engineering mathematics",
 "FEA fundamentals::Finite element theory; Element types; Meshing",
 "Structural and thermal analysis::Static and modal analysis; Thermal analysis; Contacts and boundary conditions",
 "Advanced analysis::Nonlinear analysis; Fatigue and buckling; CFD basics",
 "Industry practice::Result validation; Reporting; Project"],
autoembedded:[
 "Automotive basics::Vehicle systems; Automotive electronics; ECU overview",
 "Embedded foundations::Embedded C; Microcontroller peripherals; RTOS basics",
 "Vehicle networks::CAN and LIN; Diagnostics and UDS; Calibration basics",
 "Software architecture::AUTOSAR concepts; Model-based development; Functional safety (ISO 26262) overview",
 "EV systems::Battery management systems; Motor control; Charging standards; Vehicle project"],
labview:[
 "LabVIEW basics::Front panel and block diagram; Data types and structures; Debugging",
 "Programming patterns::Loops, state machines and event structures; SubVIs; File I/O",
 "Data acquisition::DAQ hardware; Sensor signal conditioning; Instrument control",
 "Advanced LabVIEW::Producer-consumer architectures; Real-time and FPGA overview; Reporting",
 "Project::Test and measurement project; Documentation"],
plant3d:[
 "Plant engineering basics::Process plants and P&IDs; Piping components and specifications; Piping codes overview",
 "{tool} fundamentals::Interface and navigation; Equipment modelling; Catalogues and specifications",
 "Piping and structures::Piping routing; Supports and structural modelling; Cable trays and ducts",
 "Deliverables::Isometrics and drawings; Clash detection; Material take-off and reports",
 "Project::Model a plant section end to end; Review and issue"],
mep:[
 "MEP fundamentals::HVAC, plumbing, electrical and fire systems; Reading MEP drawings; Codes and standards",
 "Design calculations::Heat load and ventilation; Water supply and drainage sizing; Electrical load calculations",
 "Modelling::AutoCAD for MEP; Revit MEP modelling; Families and templates",
 "Coordination::Clash detection with Navisworks; Coordination workflow; Shop drawings",
 "Project::Multi-storey building MEP design; Quantities and BOQ"],
hvac:[
 "HVAC fundamentals::Psychrometrics; Refrigeration cycle; Air-conditioning systems",
 "Load calculation::Heat load estimation; Software tools; Ventilation requirements",
 "Distribution design::Duct sizing and layout; Pipe sizing; Diffusers and grilles",
 "Equipment and drawings::Chiller, AHU and FCU selection; HVAC drawings; BOQ",
 "Project::Commercial building HVAC design; Review"],
ecad:[
 "Electronics basics::Components and datasheets; Circuit analysis; Power supplies",
 "Schematic design::Schematic capture in OrCAD or Altium; Libraries; Design rule checks",
 "PCB layout::Placement and routing; Layer stack-up; Plane design",
 "Advanced design::Signal integrity basics; EMI and EMC; Design for manufacturing",
 "Project::Complete board design with fabrication outputs"],
productdesign:[
 "Design basics::Engineering drawing; Product development process; Materials",
 "3D CAD::Sketching and part modelling; Assemblies; Drawings and BOM",
 "Surfacing and tolerancing::Surface modelling; GD&T; Tolerance stack-up",
 "Design for manufacturing::Plastics design; Sheet metal; Casting and machining",
 "Portfolio::Complete product design project; Design review"],
industrialdesign:[
 "Design foundations::Form, proportion and ergonomics; Design thinking; Design history and trends",
 "Concept development::Ideation sketching; Mood boards; Concept presentation",
 "3D modelling::CAD modelling; Surface modelling; Class A basics",
 "Visualisation::Rendering; Prototyping and 3D printing; Colour, material and finish",
 "Portfolio::End-to-end product project; Presenting to stakeholders"],
automotivedesign:[
 "Automotive fundamentals::Vehicle architecture; Body in white, chassis and interiors; Manufacturing processes",
 "CAD modelling::Part and assembly modelling in CATIA or NX; Surface modelling; Drawings",
 "Body and trim design::Plastic trim design; Sheet metal design; Joining methods",
 "Tolerance and quality::GD&T; Tolerance stack-up; Design failure analysis",
 "Validation and project::Packaging and validation; Design review; Capstone project"],
hybrid:[
 "Vehicle fundamentals::Vehicle systems; ICE and transmission basics; Performance parameters",
 "Hybrid and EV architectures::Series, parallel and series-parallel hybrids; Battery and motor fundamentals; Power electronics overview",
 "Vehicle dynamics::Ride and handling; Braking and steering; Load cases",
 "Analysis::CAE for structure and crash; Thermal management; Result interpretation",
 "Project::Hybrid vehicle design study; Report and review"],
rnd:[
 "Design engineering basics::Engineering drawing; Materials and manufacturing; Standards",
 "CAD::3D part and assembly modelling; Drawings; Design tables",
 "Analysis::FEA fundamentals; Static and thermal analysis; Result validation",
 "Product development::Benchmarking and requirements; DFMEA; Prototyping and testing",
 "Project::R&D design project; Documentation and presentation"],
wiring:[
 "Electrical fundamentals::Circuits and electrical components; Wires, connectors and terminals; Wire gauges and current ratings",
 "Harness basics::Harness architecture; Reading schematics; Protection and sleeving",
 "Harness design::2D harness drawing; Formboard design; Bill of materials",
 "Tools and standards::Harness design software; Automotive standards; Manufacturing and testing",
 "Project::Complete vehicle harness design; Review"],
cam:[
 "Machining fundamentals::Machine tools and cutting tools; Materials; Work holding",
 "CNC programming::G-code and M-code; Coordinate systems; Canned cycles",
 "CAM software::2D toolpaths; 3D surface machining; Tool libraries",
 "Advanced CAM::Multi-axis basics; Post-processing; Simulation and verification",
 "Project::Machining project from model to part; Review"],
cadcam:[
 "Drawing and tolerancing::Engineering drawing; GD&T; Materials",
 "3D CAD::Part and assembly modelling; Surface modelling; Drawings",
 "CAM::Toolpaths for milling and turning; CNC programming; Post-processing",
 "Advanced manufacturing::Multi-axis machining; Mould and die basics; Simulation",
 "Project::Design-to-manufacture project; Review"],
bim:[
 "BIM fundamentals::BIM concepts and workflow; Levels of detail; Standards",
 "Architectural modelling::Revit architecture modelling; Families; Sheets and annotation",
 "Multi-discipline modelling::Structural modelling; MEP modelling; Linking models",
 "Coordination::Clash detection with Navisworks; 4D scheduling; 5D cost estimation",
 "Project::Full building BIM project; Model review"],
architectural:[
 "Drafting::AutoCAD for architecture; Plans, sections and elevations; Drawing standards",
 "Modelling::Revit or SketchUp modelling; Materials; Families",
 "Codes and detailing::Building codes; Construction details; Working drawings",
 "Visualisation::Rendering and walkthroughs; Presentation boards",
 "Portfolio::Building design project; Portfolio review"],
structural:[
 "Structural basics::Statics and strength of materials; Loads and load combinations; Structural systems",
 "Analysis::STAAD.Pro or ETABS modelling; Applying loads; Interpreting results",
 "Design::RCC member design; Steel member design; Foundations",
 "Detailing::Reinforcement detailing; Structural drawings; Codes and standards",
 "Project::Multi-storey structure analysis and design; Review"],
building:[
 "Planning::Building planning basics; Bye-laws and codes; Space layout",
 "Drawing::AutoCAD plans, sections and elevations; Working drawings; Detailing",
 "3D modelling::Building modelling; Visualisation; Walkthroughs",
 "Estimation::Quantity take-off; Cost estimation; BOQ",
 "Project::Residential building project; Review"],
interior:[
 "Design foundations::Design principles; Space planning; Colour and materials",
 "Drafting::AutoCAD for interiors; Furniture and detail drawings; Working drawings",
 "3D modelling::SketchUp or 3ds Max; Lighting; Materials and textures",
 "Visualisation::V-Ray rendering; Presentation boards; Cost estimation",
 "Portfolio::Residential and commercial interior projects; Portfolio review"],
fullstack:[
 "Python foundations::Syntax, data types and control flow; Functions, modules and OOP; File handling and error handling; Git and GitHub",
 "Frontend::HTML5 and semantic markup; CSS, Flexbox and responsive design; JavaScript ES6+ and the DOM; React components, hooks and routing",
 "Backend with Python::Django fundamentals: models, views, templates; Flask basics; REST APIs with Django REST Framework; Authentication and permissions",
 "Databases::SQL fundamentals and joins; PostgreSQL or MySQL; ORM and migrations; MongoDB overview",
 "Build and deploy::Testing with pytest; Docker basics; Deploying to a cloud server; CI/CD with GitHub Actions"],
cyber:[
 "Security foundations::CIA triad and threat landscape; Networking essentials: TCP/IP, DNS, HTTP; Linux and command line; Cryptography basics",
 "Ethical hacking::Reconnaissance and scanning; Vulnerability assessment; Exploitation basics in lab environments; Password and wireless attacks",
 "Web and application security::OWASP Top 10; Burp Suite and web testing; Secure coding practices; API security",
 "Network, cloud and SOC::Firewalls, IDS and IPS; SIEM and log analysis; Incident response; Cloud security basics",
 "Professional practice::Penetration test methodology and reporting; Governance, risk and compliance overview; Certification preparation (CEH or Security+ style)"],
generic:[
 "Foundations::Core concepts; Tools and environment setup; Guided exercises",
 "Core skills::Hands-on modules; Practical assignments; Mentor reviews",
 "Applied practice::Industry scenarios; Tool proficiency; Mini project",
 "Advanced topics::Specialised techniques; Best practices; Case studies",
 "Professional readiness::Project documentation; Presentation; Interview preparation"]
};

// First match wins, so keep specific patterns above general ones.
const ROADMAP_RULES = [
  [/automotive embedded/,"autoembedded"],[/hybrid/,"hybrid"],[/wiring harness/,"wiring"],
  [/cad \/ cam|cad\/cam/,"cadcam"],[/\bcam\b/,"cam"],[/\bcae\b|simulation/,"simulation"],
  [/industrial design/,"industrialdesign"],[/automotive design/,"automotivedesign"],
  [/product design/,"productdesign"],[/r&d/,"rnd"],[/\bbim\b/,"bim"],[/architectural/,"architectural"],
  [/structural/,"structural"],[/building design/,"building"],[/interior/,"interior"],
  [/python full stack/,"fullstack"],[/cyber/,"cyber"],[/python/,"python"],[/java\b/,"java"],[/php|laravel/,"php"],[/wordpress/,"wordpress"],[/\.net/,"dotnet"],
  [/android/,"android"],[/flutter/,"flutter"],[/web design/,"webdev"],[/mean\b/,"mean"],[/mern\b/,"mern"],
  [/software testing/,"testing"],[/business analytics/,"bizanalytics"],[/data analytics/,"analytics"],
  [/data science/,"datasci"],[/ui\/ux/,"uiux"],[/aws/,"aws"],[/azure/,"azure"],[/networking/,"networking"],
  [/digital marketing/,"digitalmarketing"],[/scrum/,"scrum"],[/rpa/,"rpa"],[/industrial automation/,"indauto"],
  [/robotics/,"robotics"],[/automation/,"automation"],[/embedded/,"embedded"],[/iot/,"iot"],
  [/e-cad/,"ecad"],[/pcb/,"pcb"],[/vlsi/,"vlsi"],[/labview/,"labview"],
  [/e3d|sp3d|pdms/,"plant3d"],[/mep/,"mep"],[/hvac/,"hvac"]
];

/* ---------- Helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const inr = n => "₹" + Number(n).toLocaleString("en-IN");
const slugify = s => s.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");

function levelOf(name){
  if(/^Masters/.test(name)) return "Masters";
  if(/^PG /.test(name)) return "PG";
  if(/^Professional/.test(name)) return "Professional";
  if(/^Diploma/.test(name)) return "Diploma";
  if(/^Certified/.test(name)) return "Certified";
  return "Program";
}
const LEVEL_LABEL = {Certified:"Certification",Masters:"Masters",PG:"PG Program",Professional:"Professional Program",Diploma:"Diploma",Program:"Program"};

function buildRoadmap(course){
  const n = course.name.toLowerCase();
  const rule = ROADMAP_RULES.find(([re]) => re.test(n));
  const key = rule ? rule[1] : "generic";
  const tool = (n.match(/e3d|sp3d|pdms/)||[""])[0].toUpperCase();
  let phases = R[key].map(p => {
    const [title, topics] = p.split("::");
    return { title: title.replace("{tool}", tool), topics: topics.split(";").map(t => t.trim().replace("{tool}", tool)) };
  });
  if(course.level === "Certified"){
    phases = phases.slice(0,3);
    phases.push({title:"Mini project & certification", topics:["Guided mini project","Assessment under Pumo Technovation","Industry recognised certificate"]});
  } else {
    phases.push({title:"Capstone project", topics:["Industry-style capstone project","Mentor code or design reviews","Final assessment and certificate"]});
    phases.push({title:"Placement preparation", topics:["Resume and portfolio","Mock interviews","Placement cell support"]});
  }
  const total = course.weeks, per = total / phases.length;
  phases.forEach((p,i) => {
    const a = Math.round(i*per)+1, b = Math.round((i+1)*per);
    p.when = a === b ? `Week ${a}` : `Weeks ${a}–${b}`;
  });
  return phases;
}

/* Flat list of all courses with derived fields */
const ALL_COURSES = [];
const BY_SLUG = {};
COURSES.forEach((c, ci) => c.items.forEach(name => {
  const level = levelOf(name);
  const course = {
    slug: slugify(name), name, cat: c.cat, ico: c.ico, ci, level,
    weeks: WEEKS_OVERRIDE[name] ?? WEEKS_BY_LEVEL[level],
    price: PRICE_OVERRIDE[name] ?? PRICE_BY_LEVEL[level]
  };
  course.roadmap = buildRoadmap(course);
  ALL_COURSES.push(course);
  BY_SLUG[course.slug] = course;
}));
const durationText = w => w >= 4 ? `${Math.round(w/4)} months` : `${w} weeks`;

/* ---------- Fees ---------- */
const gstOf   = fee => Math.round(fee * GST_RATE);
const totalOf = fee => fee + gstOf(fee);
const feeSum  = slugs => slugs.reduce((t, x) => t + BY_SLUG[x].price, 0);
const payNowOf = (total, plan) => plan === "part" ? Math.round(total * INSTALMENT.firstPct / 100) : total;
const gstLabel = `GST (${Math.round(GST_RATE*100)}%)`;

/* ---------- Sections (IT, Mechanical & Design, ...) ---------- */
const SECTION_SLUG = COURSES.map(c => slugify(c.cat));
const SECTION_BY_SLUG = {};
SECTION_SLUG.forEach((sl, i) => SECTION_BY_SLUG[sl] = i);
let activeSection = null;

function cardHTML(c){
  return `
    <article class="course-card">
      <div class="cc-top"><div class="cc-ico">${c.ico}</div><span class="cc-level">${LEVEL_LABEL[c.level]}</span></div>
      <h3 class="cc-name"><a href="#course/${c.slug}">${esc(c.name)}</a></h3>
      <p class="cc-meta">${durationText(c.weeks)} · Classroom or online-live</p>
      <div class="cc-badges"><span>Placement Assistance</span><span>Industry Certificate</span></div>
      <div class="cc-foot">
        <div class="cc-price">${inr(c.price)}<small> + GST</small></div>
        <a href="#course/${c.slug}" class="cc-more">Roadmap &amp; fees</a>
        <button class="cc-add" data-add="${c.slug}" aria-label="Add ${esc(c.name)} to cart">Add to cart</button>
      </div>
    </article>`;
}

function tileHTML(cat, i){
  const names = cat.items.map(n => n);
  const list = names.length <= 3 ? names.join(", ") : names.slice(0,3).join(", ") + `, +${names.length-3} more`;
  return `
    <a class="tile" href="#section/${SECTION_SLUG[i]}">
      <div class="tile-ico">${cat.ico}</div>
      <h3>${esc(cat.cat)}</h3>
      <p class="tile-list">${esc(list)}</p>
      <div class="tile-foot"><span>${names.length} program${names.length>1?"s":""}</span><span class="tile-go">Open</span></div>
    </a>`;
}

function renderCourses(filter = ""){
  const wrap = document.getElementById("courseCategories");
  const q = filter.trim().toLowerCase();
  const chips = document.getElementById("catChips"); if(chips) chips.remove();
  let html = "", total = 0;

  if(q){
    // Search: matching programs from every section
    COURSES.forEach((cat, i) => {
      const items = ALL_COURSES.filter(c => c.ci === i && c.name.toLowerCase().includes(q));
      if(!items.length) return;
      total += items.length;
      html += `<div class="cat-block"><div class="cat-head"><div class="cat-ico">${cat.ico}</div><div class="cat-title">${esc(cat.cat)}</div>
        <div class="cat-count">${items.length} program${items.length>1?"s":""}</div></div>
        <div class="course-grid">${items.map(cardHTML).join("")}</div></div>`;
    });
  } else if(activeSection !== null){
    const cat = COURSES[activeSection];
    const items = ALL_COURSES.filter(c => c.ci === activeSection);
    total = items.length;
    html = `<div class="sec-view">
      <a href="#courses" class="sec-back">← All course sections</a>
      <div class="sec-head"><div class="cat-ico">${cat.ico}</div>
        <div><h3>${esc(cat.cat)}</h3><p>${items.length} program${items.length>1?"s":""}. Open a program to see its roadmap, fees and how to enrol.</p></div></div>
      <div class="course-grid">${items.map(cardHTML).join("")}</div></div>`;
  } else {
    total = COURSES.length;
    html = `<div class="tile-grid">${COURSES.map(tileHTML).join("")}</div>`;
  }
  wrap.innerHTML = html;
  document.getElementById("noResults").hidden = total !== 0;
}

/* ---------- Overlay plumbing ---------- */
let openLayers = 0;
function lockScroll(on){
  openLayers = Math.max(0, openLayers + (on ? 1 : -1));
  document.body.style.overflow = openLayers ? "hidden" : "";
}
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Cart ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("sss_cart") || "[]").filter(s => BY_SLUG[s]); } catch(e){ cart = []; }
const saveCart = () => { try { localStorage.setItem("sss_cart", JSON.stringify(cart)); } catch(e){} };

function addToCart(slug){
  if(cart.includes(slug)){ toast("Already in your cart"); openCart(); return; }
  cart.push(slug); saveCart(); renderCart(); toast("Added to cart");
}
function removeFromCart(slug){ cart = cart.filter(s => s !== slug); saveCart(); renderCart(); }

function renderCart(){
  document.querySelectorAll(".cart-count").forEach(el => { el.textContent = cart.length; el.hidden = !cart.length; });
  const body = document.getElementById("cartBody"), foot = document.getElementById("cartFoot");
  if(!cart.length){
    body.innerHTML = `<div class="cart-empty"><p>Your cart is empty.</p><a href="#courses" class="btn btn-primary" data-close-cart>Browse courses</a></div>`;
    foot.hidden = true; return;
  }
  body.innerHTML = cart.map(s => { const c = BY_SLUG[s]; return `
    <div class="cart-item">
      <div><a href="#course/${c.slug}" data-close-cart class="ci-name">${esc(c.name)}</a>
      <span class="ci-meta">${LEVEL_LABEL[c.level]} · ${durationText(c.weeks)}</span></div>
      <div class="ci-right"><strong>${inr(c.price)}</strong><button data-remove="${c.slug}" aria-label="Remove ${esc(c.name)}">Remove</button></div>
    </div>`; }).join("");
  const fee = feeSum(cart);
  document.getElementById("cartSub").textContent = inr(fee);
  document.getElementById("cartGstLabel").textContent = gstLabel;
  document.getElementById("cartGst").textContent = inr(gstOf(fee));
  document.getElementById("cartTotal").textContent = inr(totalOf(fee));
  foot.hidden = false;
}
function openCart(){
  const d = document.getElementById("cartDrawer");
  if(!d.hidden) return;
  d.hidden = false; lockScroll(true);
  requestAnimationFrame(() => d.classList.add("open"));
}
function closeCart(){
  const d = document.getElementById("cartDrawer");
  if(d.hidden) return;
  d.classList.remove("open");
  setTimeout(() => { d.hidden = true; }, 250); lockScroll(false);
}

/* ---------- Course page (roadmap + fees + buy options) ---------- */
let currentCourse = null;
function showCourse(c){
  currentCourse = c;
  const v = document.getElementById("courseView");
  const wasHidden = v.hidden;
  const gst = gstOf(c.price), total = totalOf(c.price);
  const first = payNowOf(total, "part");
  const secLink = "#section/" + slugify(c.cat);
  v.innerHTML = `
    <div class="cv-inner">
      <button class="cv-close" data-close-course aria-label="Close course">✕ Close</button>
      <nav class="cv-crumb" aria-label="Breadcrumb"><a href="#courses" data-close-course>Courses</a> / <a href="${secLink}" data-close-course>${esc(c.cat)}</a> / ${esc(c.name)}</nav>
      <div class="cv-grid">
        <div class="cv-main">
          <h1>${esc(c.name)}</h1>
          <div class="cv-tags">
            <span>${LEVEL_LABEL[c.level]}</span><span>${durationText(c.weeks)}</span>
            <span>Classroom or online-live</span><span>Industry recognised certificate</span>
          </div>
          <p class="cv-lead">Project-based training delivered through Pumo Technovation's curriculum, with a certificate under Pumo Technovation and support from our placement cell.</p>

          <h2>Learning roadmap</h2>
          <p class="cv-sub">${c.roadmap.length} stages, ${durationText(c.weeks)} in total. Each stage builds on the last.</p>
          <ol class="roadmap">
            ${c.roadmap.map(p => `
              <li>
                <div class="rm-head"><h3>${esc(p.title)}</h3><span>${p.when}</span></div>
                <ul>${p.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
              </li>`).join("")}
          </ol>

          <h2>Fee structure</h2>
          <table class="fee-table">
            <tbody>
              <tr><td>Course fee</td><td>${inr(c.price)}</td></tr>
              <tr><td>${gstLabel}</td><td>${inr(gst)}</td></tr>
              <tr class="fee-total"><td>Total payable</td><td>${inr(total)}</td></tr>
              ${INSTALMENT.enabled ? `<tr><td>Instalment option</td><td>${inr(first)} now, ${inr(total-first)} later</td></tr>` : ""}
            </tbody>
          </table>
          <p class="cv-sub">Fee includes training, live projects, the Pumo Technovation certificate and placement assistance.</p>
        </div>

        <aside class="cv-buy" aria-label="Purchase options">
          <div class="cv-price">${inr(total)}</div>
          <p class="cv-price-note">${inr(c.price)} + ${inr(gst)} GST</p>
          ${INSTALMENT.enabled ? `
          <fieldset class="plan">
            <legend>Payment plan</legend>
            <label><input type="radio" name="plan" value="full" checked> Pay in full <b>${inr(total)}</b></label>
            <label><input type="radio" name="plan" value="part"> Pay ${inr(first)} now, balance later</label>
          </fieldset>` : ""}
          <button class="btn btn-primary cv-btn" data-buy="${c.slug}">Buy now</button>
          <button class="btn btn-ghost cv-btn" data-add="${c.slug}">Add to cart</button>
          <a class="cv-enq" target="_blank" rel="noopener" href="https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi, I want to know more about " + c.name)}">Ask a question on WhatsApp</a>
          <ul class="cv-incl">
            <li>Certificate under Pumo Technovation</li>
            <li>Live projects and mentor reviews</li>
            <li>Placement assistance</li>
          </ul>
          <p class="cv-pay">Log in, fill the registration form and pay by UPI, credit card or debit card. Your bill is generated automatically after payment.</p>
        </aside>
      </div>
    </div>`;
  v.hidden = false; v.scrollTop = 0;
  if(wasHidden) lockScroll(true);
  document.title = c.name + " — SSSEDUTECH SOLUTIONS";
}
const BASE_TITLE = document.title;
function hideCourse(){
  const v = document.getElementById("courseView");
  if(v.hidden) return;
  v.hidden = true; lockScroll(false); document.title = BASE_TITLE;
}
function scrollToCourses(){
  const el = document.getElementById("courses");
  if(el) window.scrollTo({ top: el.offsetTop - 70 });
}
function route(){
  const h = location.hash;
  let m = h.match(/^#course\/([a-z0-9-]+)$/);
  if(m && BY_SLUG[m[1]]){ showCourse(BY_SLUG[m[1]]); return; }
  hideCourse();
  m = h.match(/^#section\/([a-z0-9-]+)$/);
  const before = activeSection;
  if(m && SECTION_BY_SLUG[m[1]] !== undefined) activeSection = SECTION_BY_SLUG[m[1]];
  else if(h === "#courses" || h === "") activeSection = null;
  if(activeSection !== before || m){
    renderCourses(document.getElementById("courseSearch").value);
    if(m || h === "#courses") scrollToCourses();
  }
}
function closeCourse(){
  if(location.hash.startsWith("#course/") && currentCourse) location.hash = "#section/" + slugify(currentCourse.cat);
  else hideCourse();
}

/* Checkout, student login, registration form, payment and invoices live in account.js */

/* ---------- Events ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const add = t.closest("[data-add]"); if(add){ addToCart(add.dataset.add); return; }
  const buy = t.closest("[data-buy]");
  if(buy){ const p = document.querySelector('input[name="plan"]:checked'); openCheckout([buy.dataset.buy], p ? p.value : "full"); return; }
  const rm = t.closest("[data-remove]"); if(rm){ removeFromCart(rm.dataset.remove); return; }
  if(t.closest("[data-open-cart]")){ openCart(); return; }
  if(t.closest("[data-close-cart]")){ closeCart(); return; }
  if(t.closest("[data-close-course]")){ if(t.closest("a")) return; closeCourse(); return; }
  if(t.closest("[data-checkout]")){ if(cart.length) openCheckout(cart); return; }
  if(t.closest("[data-close-checkout]")){ closeCheckout(); return; }
});
document.addEventListener("keydown", e => {
  if(e.key !== "Escape") return;
  if(!document.getElementById("checkoutModal").hidden) closeCheckout();
  else if(!document.getElementById("cartDrawer").hidden) closeCart();
  else closeCourse();
});
addEventListener("hashchange", route);
renderCart();
route();


