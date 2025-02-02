import React, { useState } from "react";

const GetDocument = ({ selectedDocs, setSelectedDocs}) => {
  // Sample JSON Data (only document names)
//   const [documents, setDocuments] = useState([
//     { id: 1, document: "sample-1" },
//     { id: 2, document: "sample-2" },
//     { id: 3, document: "sample-3" },
//     { id: 4, document: "sample-4" },
//     { id: 5, document: "sample-5" }
//   ]);

  // State to track selected values
  

  // Handle checkbox change
  const handleCheckboxChange = (id, field) => {
    setSelectedDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              [field]: !doc[field],
              count: field === "photocopy" && !doc.photocopy ? 1 : doc.count, // Set count to 1 if photocopy is checked
            }
          : doc
      )
    );
  };

  // Handle count change (prevent count below 1 when photocopy is selected)
  const handleCountChange = (id, value) => {
    setSelectedDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id && doc.photocopy
          ? { ...doc, count: value < 1 ? 1 : value }
          : doc
      )
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    // try {
    //   const response = await fetch("http://127.0.0.1:8000/student/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(selectedDocs),
    //   });

    //   if (response.ok) {
    //     alert("Student created successfully!");
    //   } else {
    //     alert("Failed to create student.");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("An error occurred.");
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-auto">
      <table className="w-[90%]">
        <thead>
          <tr className="text-white bg-gray-700">
            <th className="h-[50px] w-[10%]">S.No</th>
            <th className="h-[50px] w-[40%]">Document</th>
            <th className="h-[50px] w-[15%]">Original</th>
            <th className="h-[50px] w-[15%]">Photocopy</th>
            <th className="h-[50px] w-[20%]">Count</th>
          </tr>
        </thead>
        <tbody>
          {selectedDocs.map((doc, index) => (
            <tr key={doc.id} className="text-center bg-gray-50 even:bg-gray-100">
              <td className="h-[50px]">{index + 1}</td>
              <td className="h-[50px]">{doc.document}</td>
              <td className="h-[50px]">
                <input
                  className="w-5 h-5"
                  type="checkbox"
                  checked={doc.original}
                  onChange={() => handleCheckboxChange(doc.id, "original")}
                />
              </td>
              <td className="h-[50px]">
                <input
                  className="w-5 h-5"
                  type="checkbox"
                  checked={doc.photocopy}
                  onChange={() => handleCheckboxChange(doc.id, "photocopy")}
                />
              </td>
              <td className="h-[50px]">
                {doc.photocopy ? (
                  <input
                    type="number"
                    min="1"
                    value={doc.count}
                    onChange={(e) => handleCountChange(doc.id, Number(e.target.value))}
                    className="w-16 text-center border border-gray-400"
                  />
                ) : (
                  <span className="text-gray-500">0</span> // Show "0" instead of input box
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Student Button */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Create Student
      </button>
    </div>
  );
};

export default GetDocument;
