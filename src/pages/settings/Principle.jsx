import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchMaxNumberOfPatients,
  fetchFeeConsult,
  updateFeeConsult,
  updateMaxNumberOfPatients,
} from "../../services/argument";

function PrincipleView() {
  const maxpatientsQuery = useQuery({
    queryKey: ["maxpatients"],
    queryFn: fetchMaxNumberOfPatients,
  });

  const feeConsultQuery = useQuery({
    queryKey: ["feeconsult"],
    queryFn: fetchFeeConsult,
  });

  const maxPatientsMutate = useMutation({
    mutationFn: updateMaxNumberOfPatients,
  });

  const feeConsultMutate = useMutation({
    mutationFn: updateFeeConsult,
  });

  function submitHanlder(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (data.maxpatients!==maxpatientsQuery.data) {
      const maxnumberofpatients = data.maxpatients;
      maxPatientsMutate.mutate({ maxNumberOfPatients: maxnumberofpatients });
    }

    if (data.feeconsult!==feeConsultQuery.data) {
      const feeconsult = data.feeconsult;
      feeConsultMutate.mutate({ feeConsult: feeconsult });
    }
  }

  return (
    <div className="col">
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#F9F9F9" }}
      >
        <div
          className="w-50 modal-content rounded-4 shadow  content position-absolute top-50 mt-50 start-50 translate-middle"
          style={{ height: "fit-content", backgroundColor: "#FEFEFE" }}
        >
          <div className=" p-5 pb-4 border-bottom-0 align-self-center">
            <p className="fw-bold mb-10 fs-2 ">Principle Settings</p>
          </div>

          <div className="modal-body p-5 pt-0">
            <form onSubmit={submitHanlder}>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control rounded-3"
                  id="maxpatients"
                  placeholder="maxpatients"
                  name="maxpatients"
                  defaultValue={maxpatientsQuery && maxpatientsQuery?.data}
                />
                <label htmlFor="maxpatients">
                  Số bệnh nhân tối đa trong ngày
                </label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control rounded-3"
                  id="feeconsult"
                  placeholder="feeconsult"
                  name="feeconsult"
                  defaultValue={feeConsultQuery && feeConsultQuery?.data}
                />
                <label htmlFor="feeconsult">Phí khám bệnh</label>
              </div>

              <div className="w-100 d-flex justify-content-center gap-5">
                <button
                  className="btn btn-lg btn btn-outline-primary rounded-pill "
                  type="button"
                  style={{ width: "200px" }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-lg btn btn-primary rounded-pill "
                  type="submit"
                  style={{ width: "200px" }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrincipleView;
