import React from "react";
const DocumentRow = ({ doc, index, handleCheckboxChange, handleCountChange }) => {
  return (
    <tr className="text-center bg-gray-50 even:bg-gray-100">
      <td className="h-[50px]">{index + 1}</td>
      <td className="h-[50px]">{doc.name}</td>
      <td className="h-[50px]">
        <input
          className="w-5 h-5"
          type="checkbox"
          checked={doc.original || false}
          onChange={() => handleCheckboxChange(doc.id, "original")}
        />
      </td>
      <td className="h-[50px]">
        <input
          className="w-5 h-5"
          type="checkbox"
          checked={doc.photocopy || false}
          onChange={() => handleCheckboxChange(doc.id, "photocopy")}
        />
      </td>
      <td className="h-[50px]">
        {doc.photocopy ? (
          <input
            type="number"
            min="1"
            value={doc.count || 1}
            onChange={(e) => handleCountChange(doc.id, Number(e.target.value))}
            className="w-16 text-center border border-gray-400"
          />
        ) : (
          <span className="text-gray-500">0</span>
        )}
      </td>
    </tr>
  );
};
const GetDocument = ({ selectedDocs, setSelectedDocs, handleSubmitStudent, loading1, setLoading1}) => {
  const handleCheckboxChange = (id, field) => {
    setSelectedDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              [field]: !doc[field], // Toggle the specific field (original or photocopy)
              count: field === "photocopy" && !doc.photocopy ? 1 : doc.count, // Set count to 1 if photocopy is checked
            }
          : doc
      )
    );
  };
  
  const handleCountChange = (id, value) => {
    setSelectedDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id && doc.photocopy
          ? { ...doc, count: Math.max(1, value) } // Ensure count is at least 1
          : doc
      )
    );
  };
  
  const onSubmit = () => {
    setLoading1(true);
    handleSubmitStudent();
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
            <DocumentRow
              key={index} // Use the index as key (not ideal for long-term use)
              doc={doc}
              index={index}
              handleCheckboxChange={handleCheckboxChange}
              handleCountChange={handleCountChange}
            />
          ))}
        </tbody>
      </table>

      <button
        onClick={onSubmit}
        disabled={loading1}
        className="px-6 py-2 my-4 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center justify-center min-w-[150px]"
      >
        {loading1 ? (
          <>
            <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            Processing...
          </>
        ) : (
          "Create Student"
        )}
      </button>
    </div>
  );
};

export default GetDocument;