import React from 'react'

const FilterBox = () => {
    return (
        <>
            <div className='flex items-center justify-center w-full h-auto mt-10'>
                <div className='w-[90%] h-auto flex items-center justify-center flex-wrap gap-8'>
                    <div className='flex flex-col'>
                        <label htmlFor="remark" className="block mb-1 font-bold text-gray-700">With remark:</label>
                        <select
                            className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                            name="dept"
                            id="dept"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="remark" className="block mb-1 font-bold text-gray-700">Category:</label>
                        <select
                            className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                            name="dept"
                            id="dept"
                        >
                            <option value="ALL">ALL</option>
                            <option value="UG">UG</option>
                            <option value="PG">PG</option>
                            <option value="LATERAL">LATERAL</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center w-full'>

                <button className='w-[50%] h-[50px] bg-blue-500 text-white font-semibold rounded-lg mt-10'>
                    Dowload Files
                </button>
            </div>
        </>

    )
}

export default FilterBox