import React, { useState } from "react";

const NavBar = (props) => {
  const groupVariables = [
    {
      name: "AgeClass",
      label: "Age",
    },
    { name: "SexClass", label: "Sex" },
  ];

  const charactVariable = [
    {name:"WingLength",label:"Wing Length"},
    {name:"Weight",label:"Weight"},
    {name:"Condition",label:"Condition"},
    {name:"Fat",label:"Fat",values:["None","Trace","Low","Medium","High","Bulging"]},
    {name:"Skull",label:"Skull",values:["None","Trace","Less","Half","Greater","Almost","Full"]},
    {name:"Juv",label:"Juvenal Plumage",values:["None","<Half","Half",">Half","Full"]},
    {name:"BMolt",label:"Body Molt",values:["None","Trace","Light","Medium","Heavy"]},
    {name:"FFMolt",label:"FF Molt",values:["None","Symmetrical"]},
    {name:"FFWear",label:"FF Wear",values:["None","Slight","Light","Moderate","Heavy","Excessive"]},
    {name:"Cloaca",label:"Cloacal Protuberance",values:["None","Small","Medium","Large"]},
    {name:"Brood",label:"Brood Patch",values:["None","Smooth","Vascularized","Heavy","Wrinkled","Molting"]},
  ]
  const {
    variables,
    setVariables,
    maxYHook,
    setPlotVariable,
    plot_variable,
  } = props;
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <Logo></Logo>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <FixY maxYHook={maxYHook}></FixY>
        <GroupVarMenu variableSet={groupVariables} variableHook={{ variables, setVariables }}></GroupVarMenu>
        <CharacterVarMenu
        variableSet={charactVariable}
          variableHook={{
            variables: plot_variable,
            setVariables: setPlotVariable,
          }}
        >A</CharacterVarMenu>
        {/* <div class="relative inline-block text-left">
            <div>
              <span class="rounded-md shadow-sm mx-3">
                <button
                  type="button"
                  class="inline-flex px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                  onClick={() =>
                    openGroupVar === "variables"
                      ? setGroupOpen("")
                      : setGroupOpen("variables")
                  }
                >
                  <p className="font-bold">Plot Variables</p>
                  <svg
                    class="-mr-1 ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`${
                openGroupVar === "variables" ? "" : "hidden"
              } origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg`}
            >
              <div class="rounded-md bg-white shadow-xs">
                <div
                  class="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <label class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                    <input
                      class="mr-2 leading-tight"
                      onChange={() =>
                        plot_variables === "Weight"
                          ? setPlotVariables(
                              variables.filter((vari) => vari !== "AgeClass")
                            )
                          : setPlotVariables([...variables, "AgeClass"])
                      }
                      checked={variables.indexOf("AgeClass") > -1}
                      type="checkbox"
                    />
                    <span class="text-sm">Age </span>
                  </label>

                  <label class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                    <input
                      class="mr-2 leading-tight"
                      onChange={() =>
                        variables.indexOf("SexClass") > -1
                          ? setPlotVariables(
                              variables.filter((vari) => vari !== "SexClass")
                            )
                          : setPlotVariables([...variables, "SexClass"])
                      }
                      checked={variables.indexOf("SexClass") > -1}
                      type="checkbox"
                    />
                    <span class="text-sm">Sex </span>
                  </label>
                </div>
              </div>
            </div> */}
        {/* </div> */}
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center flex-shrink-0 text-white mr-6">
      <span className="font-semibold text-xl tracking-tight">SPLATS</span>
    </div>
  );
};

const FixY = (props) => {
  const { maxYHook } = props;
  return (
    <div class="relative inline-block text-left">
      <label htmlFor="toogleA" className="flex items-center cursor-pointer">
        <div class="relative">
          <input
            id="toogleA"
            onClick={() => maxYHook.setFixedY(!maxYHook.fixedY)}
            type="checkbox"
            class="hidden"
          />
          <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-2 left-0"></div>
        </div>
        <div className="ml-3 text-white  font-bold">Fix Y Axis</div>
      </label>
    </div>
  );
};

const GroupVarMenu = (props) => {
  const {variableSet,variableHook}= props
  const { variables, setVariables,  } = variableHook;

  const [openGroupVar, setGroupOpen] = useState("");

  return (
    <div class="relative inline-block text-left">
      <div>
        <span class="rounded-md shadow-sm mx-3">
          <button
            type="button"
            class="inline-flex px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            onClick={() =>
              openGroupVar === "variables"
                ? setGroupOpen("")
                : setGroupOpen("variables")
            }
          >
            <p className="font-bold">Groups</p>
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      <div
        className={`${
          openGroupVar === "variables" ? "" : "hidden"
        } origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg`}
      >
        <div class="rounded-md bg-white shadow-xs">
          <div
            class="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {variableSet.map((vari) => (
              <GroupOptions
                variables={variables}
                setVariables={setVariables}
                this_variable={vari}
              ></GroupOptions>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupOptions = (props) => {
  const { variables, setVariables, this_variable } = props;

  return (
    <label class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
      <input
        class="mr-2 leading-tight"
        onChange={() =>
          variables.indexOf(this_variable.name) > -1
            ? setVariables(
                variables.filter((vari) => vari !== this_variable.name)
              )
            : setVariables([...variables, this_variable.name])
        }
        checked={variables.indexOf(this_variable.name) > -1}
        type="checkbox"
      />
      <span class="text-sm">{this_variable.label} </span>
    </label>
  );
};


const CharacterVarMenu = (props) => {
  const {variableSet,variableHook}= props
  const { variables, setVariables,  } = variableHook;

  const [openGroupVar, setGroupOpen] = useState("");

  return (
    <div class="relative inline-block text-left">
      <div>
        <span class="rounded-md shadow-sm mx-3">
          <button
            type="button"
            class="inline-flex px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            onClick={() =>
              openGroupVar === "variables"
                ? setGroupOpen("")
                : setGroupOpen("variables")
            }
          >
            <p className="font-bold">Variable</p>
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      <div
        className={`${
          openGroupVar === "variables" ? "" : "hidden"
        } origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg`}
      >
        <div class="rounded-md bg-white shadow-xs">
          <div
            class="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {variableSet.map((vari) => (
              <CharacterOption
                variables={variables}
                setVariables={setVariables}
                this_variable={vari}
              ></CharacterOption>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CharacterOption = (props) => {
  const { variables, setVariables, this_variable } = props;

  return (
    <label class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
      <input
        class="mr-2 leading-tight"
        onChange={() =>
              setVariables(this_variable)
        }
        checked={variables.name===this_variable.name}
        type="radio"
      />
      <span class="text-sm">{this_variable.label} </span>
    </label>
  );
};
export default NavBar;
