import React, { useState } from 'react';

const DocumentTable = ({ studentData, editMode}) => {
  const [fileData, setFileData] = useState(studentData.files);

  const handleCheckboxChange = (e, fileId, field) => {
    const { checked } = e.target;  
    setFileData(prevFileData =>
      prevFileData.map(file => {
        if (file.id === fileId) {
          
          if (field === 'photocopy' && checked) {
            return { ...file, [field]: checked, count: 1 };  
          } else if (field === 'photocopy' && !checked) {
            return { ...file, [field]: checked, count: '' }; 
          } else {
            return { ...file, [field]: checked };
          }
        }
        return file;
      })
    );
  };


  const handleCountChange = (e, fileId) => {
    let { value } = e.target;
    value = Math.max(0, Number(value)); // Ensure count never goes below 0
  
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
              <td className='flex items-center justify-center outline-none'>
                {editMode && file.photocopy ? (
                  <input
                    type="number"
                    name="count"
                    id={`count-${file.id}`}
                    className="w-10 py-2"
                    value={file.count || 1}  // Default to 1 if count is empty or not set
                    onChange={(e) => handleCountChange(e, file.id)}  // Correctly call handleCountChange here
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
