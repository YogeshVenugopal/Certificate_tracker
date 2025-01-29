import React, { useState } from 'react';

const DocumentTable = ({ studentData, editMode }) => {
  // Initialize the fileData state using studentData.files
  const [fileData, setFileData] = useState(studentData.files);

  // Handle changes for checkboxes (original and photocopy)
  const handleCheckboxChange = (e, fileId, field) => {
    const { checked } = e.target;  // Get the checkbox state
    setFileData(prevFileData =>
      prevFileData.map(file => {
        if (file.id === fileId) {
          // If photocopy is being checked, set count to 1 automatically
          if (field === 'photocopy' && checked) {
            return { ...file, [field]: checked, count: 1 };  // Set count to 1 if photocopy is checked
          } else if (field === 'photocopy' && !checked) {
            return { ...file, [field]: checked, count: '' };  // Optionally reset count when unchecked
          } else {
            return { ...file, [field]: checked };
          }
        }
        return file;
      })
    );
  };

  // Handle changes for count input
  const handleCountChange = (e, fileId) => {
    const { value } = e.target;  // Get the new count value
    setFileData(prevFileData =>
      prevFileData.map(file =>
        file.id === fileId ? { ...file, count: value } : file
      )
    );
  };

  return (
    <div className="flex items-center justify-center w-full">
      <table className="w-[90%]">
        <thead className="font-semibold text-white bg-gray-700">
          <tr className="h-[50px]">
            <td className="w-[10%] text-center">S.No.</td>
            <td className="w-[30%] text-center">Document</td>
            <td className="w-[20%] text-center">Original</td>
            <td className="w-[20%] text-center">Photocopy</td>
            <td className="w-[20%] text-center">Count</td>
          </tr>
        </thead>
        <tbody>
          {fileData.map((file, index) => (
            <tr key={file.id} className="text-center h-[50px] bg-gray-50 even:bg-gray-100">
              <td>{index + 1}</td>
              <td>{file.document}</td>
              <td>
                {editMode ? (
                  <input
                    type="checkbox"
                    name="original"
                    id={`original-${file.id}`}
                    className="w-5 h-5"
                    checked={file.original}
                    onChange={(e) => handleCheckboxChange(e, file.id, 'original')}
                  />
                ) : (
                  file.original ? '✔️' : '❌'
                )}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="checkbox"
                    name="photocopy"
                    id={`photocopy-${file.id}`}
                    className="w-5 h-5"
                    checked={file.photocopy}
                    onChange={(e) => handleCheckboxChange(e, file.id, 'photocopy')}
                  />
                ) : (
                  file.photocopy ? '✔️' : '❌'
                )}
              </td>
              <td>
                {editMode && file.photocopy ? (
                  <input
                    type="number"
                    name="count"
                    id={`count-${file.id}`}
                    className="py-2"
                    value={file.count || 1}  // Default to 1 if count is empty or not set
                    onChange={(e) => handleCountChange(e, file.id)}  // Correctly call handleCountChange here
                  />
                ) : (
                  file.count
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
