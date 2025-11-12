import QuestionCard from "../../Common/QuestionCard";

const AskIbu = () => {
  const questionData = [
    {
      question: "What is artificial intelligence?",
      region: "North America",
      country: "USA",
      answer:
        "Artificial intelligence is the simulation of human intelligence processes by machines.",
      tags: ["AI", "technology", "innovation"],
      date: "2025-01-05",
    },
    {
      question: "How does blockchain work?",
      region: "Europe",
      country: "Germany",
      answer:
        "Blockchain is a distributed ledger technology that stores data in blocks linked together in a chain.",
      tags: ["blockchain", "crypto", "data"],
      date: "2025-01-10",
    },
    {
      question: "What are renewable energy sources?",
      region: "Asia",
      country: "India",
      answer:
        "Renewable energy sources include solar, wind, hydro, and geothermal energy.",
      tags: ["energy", "sustainability", "environment"],
      date: "2025-01-12",
    },
    {
      question: "What is the purpose of cloud computing?",
      region: "Oceania",
      country: "Australia",
      answer:
        "Cloud computing allows users to store and access data and applications over the internet.",
      tags: ["cloud", "storage", "computing"],
      date: "2025-01-15",
    },
    {
      question: "How does machine learning differ from AI?",
      region: "North America",
      country: "Canada",
      answer:
        "Machine learning is a subset of AI focused on enabling systems to learn from data automatically.",
      tags: ["AI", "ML", "data"],
      date: "2025-01-18",
    },
    {
      question: "What are the benefits of remote work?",
      region: "Europe",
      country: "France",
      answer:
        "Remote work increases flexibility, productivity, and work-life balance for employees.",
      tags: ["work", "remote", "productivity"],
      date: "2025-01-21",
    },
    {
      question: "What is cybersecurity?",
      region: "Asia",
      country: "Japan",
      answer:
        "Cybersecurity is the practice of protecting systems and networks from digital attacks.",
      tags: ["security", "IT", "cyber"],
      date: "2025-01-25",
    },
    {
      question: "What is data visualization?",
      region: "South America",
      country: "Brazil",
      answer:
        "Data visualization represents data graphically to identify trends, patterns, and insights.",
      tags: ["data", "charts", "visualization"],
      date: "2025-02-01",
    },
    {
      question: "How do electric vehicles help the environment?",
      region: "Europe",
      country: "Norway",
      answer:
        "Electric vehicles reduce greenhouse gas emissions and reliance on fossil fuels.",
      tags: ["EV", "environment", "transport"],
      date: "2025-02-03",
    },
    {
      question: "What is the Internet of Things (IoT)?",
      region: "Asia",
      country: "Singapore",
      answer:
        "IoT refers to interconnected devices that communicate and exchange data over the internet.",
      tags: ["IoT", "devices", "technology"],
      date: "2025-02-06",
    },
    {
      question: "What are the advantages of 5G networks?",
      region: "North America",
      country: "USA",
      answer:
        "5G networks provide faster speeds, lower latency, and improved connectivity for smart devices.",
      tags: ["5G", "network", "connectivity"],
      date: "2025-02-10",
    },
    {
      question: "What is edge computing?",
      region: "Europe",
      country: "Sweden",
      answer:
        "Edge computing processes data closer to its source to reduce latency and bandwidth usage.",
      tags: ["computing", "data", "IoT"],
      date: "2025-02-14",
    },
    {
      question: "What are quantum computers?",
      region: "Asia",
      country: "China",
      answer:
        "Quantum computers use qubits to perform calculations faster than classical computers.",
      tags: ["quantum", "computing", "technology"],
      date: "2025-02-18",
    },
    {
      question: "What is big data?",
      region: "North America",
      country: "Mexico",
      answer:
        "Big data refers to extremely large data sets that require advanced tools for analysis.",
      tags: ["data", "analytics", "tech"],
      date: "2025-02-21",
    },
    {
      question: "What is augmented reality?",
      region: "Europe",
      country: "Italy",
      answer:
        "Augmented reality overlays digital information onto the real world using devices like smartphones.",
      tags: ["AR", "tech", "visual"],
      date: "2025-02-25",
    },
    {
      question: "How does virtual reality work?",
      region: "Asia",
      country: "South Korea",
      answer:
        "Virtual reality immerses users in a simulated 3D environment using headsets and sensors.",
      tags: ["VR", "simulation", "tech"],
      date: "2025-03-01",
    },
    {
      question: "What is the purpose of UI/UX design?",
      region: "Europe",
      country: "Spain",
      answer:
        "UI/UX design ensures digital interfaces are visually appealing and easy to use.",
      tags: ["design", "UI", "UX"],
      date: "2025-03-05",
    },
    {
      question: "How does responsive web design work?",
      region: "Asia",
      country: "India",
      answer:
        "Responsive design ensures websites adapt to different screen sizes and devices.",
      tags: ["web", "design", "frontend"],
      date: "2025-03-08",
    },
    {
      question: "What is the function of APIs?",
      region: "North America",
      country: "USA",
      answer:
        "APIs allow software applications to communicate and share data seamlessly.",
      tags: ["API", "integration", "development"],
      date: "2025-03-12",
    },
    {
      question: "What is digital transformation?",
      region: "Europe",
      country: "UK",
      answer:
        "Digital transformation integrates digital technology into all areas of business operations.",
      tags: ["business", "digital", "innovation"],
      date: "2025-03-15",
    },
  ];
  return (
    <>
      {questionData.map((question, index) => {
        return (
          <div key={index}>
            <QuestionCard question={question} account={true} />
          </div>
        );
      })}
    </>
  );
};
export default AskIbu;
