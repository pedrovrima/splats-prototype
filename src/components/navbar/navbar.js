import React, { useState } from "react";

const NavBar = (props) => {
  const { variables, setVariables, maxYHook } = props;
  const [open, setOpen] = useState("");
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">SPLATS</span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
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
        <div class="relative inline-block text-left">
          <div>
            <span class="rounded-md shadow-sm mx-3">
              <button
                type="button"
                class="inline-flex px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                onClick={() =>
                  open === "variables" ? setOpen("") : setOpen("variables")
                }
              >
                <p className="font-bold">Variables</p>
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
              open === "variables" ? "" : "hidden"
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
                      variables.indexOf("AgeClass") > -1
                        ? setVariables(
                            variables.filter((vari) => vari !== "AgeClass")
                          )
                        : setVariables([...variables, "AgeClass"])
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
                        ? setVariables(
                            variables.filter((vari) => vari !== "SexClass")
                          )
                        : setVariables([...variables, "SexClass"])
                    }
                    checked={variables.indexOf("SexClass") > -1}
                    type="checkbox"
                  />
                  <span class="text-sm">Sex </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
