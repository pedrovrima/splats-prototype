import React from "react";




const NewPlot = (props)=>{

    const {setModal}=props
    return(
        <div
        className={`bg-white w-10/12  rounded-lg m-2 p-6 shadow-md flex flex-col items-center`}
      >
        <h1 className={`text-lg m-2`}>New Plot</h1>
        <div className="h-6" onClick={setModal(true)}>
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            className="h-6 text-teal-600 fill-current"
          >
            <g>
              <g>
                <path
                  d="M257,0C116.39,0,0,114.39,0,255s116.39,257,257,257s255-116.39,255-257S397.61,0,257,0z M392,285H287v107
			c0,16.54-13.47,30-30,30c-16.54,0-30-13.46-30-30V285H120c-16.54,0-30-13.46-30-30c0-16.54,13.46-30,30-30h107V120
			c0-16.54,13.46-30,30-30c16.53,0,30,13.46,30,30v105h105c16.53,0,30,13.46,30,30S408.53,285,392,285z"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    )
}