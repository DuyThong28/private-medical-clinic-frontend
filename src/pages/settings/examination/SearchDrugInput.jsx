import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { prescriptionAction } from "../../../store/prescription";

export default function SearchDrugInput() {
  const dispatch = useDispatch();
  const searchRef = useRef("");
  const [drugs, setDrugs] = useState([]);

  const unitState = useSelector((state) => state.unit);
  const drugState = useSelector((state) => state.drug);
  const usagaState = useSelector((state) => state.usage);

  function getUnitName({ id }) {
    const res = unitState.filter((unit) => unit.id === id)[0];
    return res.unitName;
  }

  function searchDrugHandler(event) {
    const textSearch = event.target.value.toLowerCase().trim();
    if (!textSearch) {
      setDrugs(() => []);
      return;
    }
    const drugResult = drugState.filter((drug) =>
      drug.drugName.toLowerCase().includes(textSearch)
    );
    setDrugs(() => drugResult);
  }

  function addHandler({ drug }) {
    dispatch(prescriptionAction.addDrug({ drug }));
    searchRef.current.value = "";
    setDrugs(() => []);
  }

  return (
    <div>
      <div className="input-group flex-nowrap">
        <span
          className="input-group-text"
          id="addon-wrapping"
          style={{ backgroundColor: "white" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </span>
        <input
          ref={searchRef}
          type="search"
          className="form-control"
          placeholder="Nhập tên thuốc"
          aria-describedby="addon-wrapping"
          onInput={searchDrugHandler}
        />
      </div>
      <div className="position-relative">
        <div className="position-absolute top-0 start-0 z-3 bg-white w-100 mt-3">
          <div className="overflow-y-scroll w-100 shadow" style={{ maxHeight: "20rem" }}>
            <ul className=" list-group list-group-flush gap-1">
              {drugs &&
                drugs.map((drug) => {
                  return (
                    <li
                      className="list-group-item list-group-item-info list-group-item-action w-100 d-flex flex-row"
                      key={drug.id}
                    >
                      <div className="text-start" style={{ width: "50%" }}>
                        Thuốc: <span className="fw-bold">{drug.drugName}</span>
                      </div>
                      <div className="text-start" style={{ width: "25%" }}>
                        Tồn kho:{" "}
                        <span className="fw-bold">
                          {drug.count} {getUnitName({ id: drug.unitId })}
                        </span>
                      </div>
                      <div className="text-end" style={{ width: "25%" }}>
                        <span
                          className="p-2"
                          onClick={() =>
                            addHandler({
                              drug: { ...drug, usageId: usagaState[0].id },
                            })
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-plus-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                          </svg>
                        </span>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
