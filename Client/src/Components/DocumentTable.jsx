import React, { useState, useEffect } from 'react';

const DocumentTable = ({ studentData, editMode, updateFileData }) => {
  // Initialize fileData with properly mapped data, adding id if not present
  const [fileData, setFileData] = useState(
    studentData.files.map((file, index) => ({
      ...file,
      id: file.id || index, // Use existing id or create one based on index
      document: file.name // Map 'name' to 'document' property
    }))
  );

  // Update local state when studentData changes
  useEffect(() => {
    setFileData(
      studentData.files.map((file, index) => ({
        ...file,
        id: file.id || index,
        document: file.name
      }))
    );
  }, [studentData]);

  // In DocumentTable.jsx
  const handleCheckboxChange = (e, fileId, field) => {
    const { checked } = e.target;

    // Find the index of the file in the array
    const fileIndex = fileData.findIndex(file => file.id === fileId);
    if (fileIndex === -1) return;

    // Create updated file with new values
    let updatedFile;
    if (field === 'photocopy') {
      updatedFile = {
        ...fileData[fileIndex],
        photocopy: checked,
        count: checked ? 1 : 0
      };
    } else {
      updatedFile = {
        ...fileData[fileIndex],
        [field]: checked
      };
    }

    // Update local state with the new file data
    setFileData(prevFileData =>
      prevFileData.map(file => file.id === fileId ? updatedFile : file)
    );

    // Notify parent component with the exact same updated file data
    if (updateFileData) {
      // Instead of making separate calls, update the entire file object at once
      updateFileData(fileIndex, 'fileObject', updatedFile);
    }
  };

  const handleCountChange = (e, fileId) => {
    let { value } = e.target;
    value = Math.max(0, Number(value)); // Ensure count never goes below 0

    // Find the index of the file in the array
    const fileIndex = fileData.findIndex(file => file.id === fileId);
    if (fileIndex === -1) return;

    // Update local state
    setFileData(prevFileData =>
      prevFileData.map(file =>
        file.id === fileId ? { ...file, count: value } : file
      )
    );

    // Notify parent component
    if (updateFileData) {
      updateFileData(fileIndex, 'count', value);
    }
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
                    checked={file.original || false}
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
                    checked={file.photocopy || false}
                    onChange={(e) => handleCheckboxChange(e, file.id, 'photocopy')}
                  />
                ) : (
                  file.photocopy ? '✔️' : '❌'
                )}
              </td>
              <td className='flex items-center justify-center outline-none'>
                {editMode && file.photocopy ? (
                  <input
                    type="number"
                    name="count"
                    id={`count-${file.id}`}
                    className="w-10 py-2"
                    min="0"
                    value={file.count || 1}  // Default to 1 if count is empty or not set
                    onChange={(e) => handleCountChange(e, file.id)}
                  />
                ) : (
                  file.count || "-"
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