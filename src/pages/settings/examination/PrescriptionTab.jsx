import { useRef, useState } from "react";
import TableBody from "../../../components/TableBody";
import TableHeader from "../../../components/TableHeader";
import { useSelector, useDispatch } from "react-redux";
import { prescriptionAction } from "../../../store/prescription";

export default function PreScriptionTab() {
  const drugState = useSelector((state) => state.drug);
  const unitState = useSelector((state) => state.unit);
  const usagaState = useSelector((state) => state.usage);
  const prescriptionState = useSelector((state) => state.prescription);
  const searchRef = useRef("");
  const dispatch = useDispatch();


  function getUnitName({ id }) {
    const res = unitState.filter((unit) => unit.id === id)[0];
    return res.unitName;
  }

  const [drugs, setDrugs] = useState([]);

  function addHandler({ drug }) {
    dispatch(prescriptionAction.addDrug({ drug }));
    searchRef.current.value = "";
    setDrugs(() => []);
  }

  function deleteHandler({ id }) {
    dispatch(prescriptionAction.removeDrug({ id: id }));
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

  function editHandler() {
  }


  function updateDrug({ event, id, type }) {
    const value = event.target.value;
    dispatch(prescriptionAction.updateDrug({ type, id, value }));
  }

  return (
    <div className="w-100 h-100 d-flex flex-column gap-3">
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
      <TableHeader>
        <div className="text-start" style={{ width: "5%" }}></div>
        <div className="text-start" style={{ width: "20%" }}>
          Tên thuốc
        </div>
        <div className="text-start" style={{ width: "15%" }}>
          Số lượng
        </div>
        <div className="text-start" style={{ width: "15%" }}>
          Đơn vị
        </div>

        <div className="text-start" style={{ width: "35%" }}>
          Cách dùng
        </div>
        <div className="text-end" style={{ width: "10%" }}>
          Thao tác
        </div>
      </TableHeader>
      <TableBody>
        {prescriptionState &&
          prescriptionState.map((drug) => {
            return (
              <li
                className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                key={drug.id}
              >
                <div className="text-start" style={{ width: "5%" }}>
                  <input
                    className="form-check-input me-1"
                    type="checkbox"
                    value=""
                    id="firstCheckbox"
                  />
                </div>
                <div className="text-start" style={{ width: "20%" }}>
                  {drug.drugName}
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step="1"
                    min="1"
                    max={drug.count}
                    defaultValue={drug.amount}
                    name="amount"
                    onChange={(event) =>
                      updateDrug({ event, id: drug.id, type: "amount" })
                    }
                  />
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  {getUnitName({ id: drug.unitId })}
                </div>
                <div className="text-start" style={{ width: "35%" }}>
                  <select
                    className="w-100"
                    name="usageid"
                    defaultValue={drug.usageId}
                    onChange={(event) =>
                      updateDrug({ event, id: drug.id, type: "usage" })
                    }
                  >
                    {usagaState &&
                      usagaState.map((usage) => {
                        return (
                          <option key={usage.id} value={usage.id}>
                            {usage.usageDes}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="text-end" style={{ width: "10%" }}>
                  <span className="p-2" onClick={() => editHandler()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#1B59F8"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                  </span>
                  <span
                    className="p-2"
                    onClick={() => deleteHandler({ id: drug.id })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#1B59F8"
                      className="bi bi-archive-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                    </svg>
                  </span>
                </div>
              </li>
            );
          })}
      </TableBody>
    </div>
  );
}
