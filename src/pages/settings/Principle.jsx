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
    console.log(data);
    if (data.maxpatients) {
      const maxnumberofpatients = data.maxpatients;
      maxPatientsMutate.mutate({ maxNumberOfPatients: maxnumberofpatients });
    }

    if (data.feeconsult) {
      const feeconsult = data.feeconsult;
      feeConsultMutate.mutate({ feeConsult: feeconsult });
    }
  }

  return (
    <>
      <>
        <div
          className=" mx-auto w-50 "
          style={{ height: "fit-content", "margin-top": "50px" }}
        >
          <div className="modal-content rounded-4 shadow content ">
            <div className=" p-5 pb-4 border-bottom-0 align-self-center">
              <p className="fw-bold mb-10 fs-2 ">Principle Settings</p>
            </div>

            <div className="modal-body p-5 pt-0">
              <form onSubmit={submitHanlder}>
                <div className="row">
                  <div className="mb-3 col">
                    <label htmlFor="maxpatients" className="col-form-label">
                      Max Number Of Patients
                    </label>
                  </div>
                  <div className="mb-3 col">
                    <input
                      type="text"
                      className="form-control"
                      id="maxpatients"
                      name="maxpatients"
                      defaultValue={maxpatientsQuery && maxpatientsQuery?.data}
                    />
                  </div>
                  <div className="col">
                    <button
                      className="w-50 mb-2 btn btn-xs rounded-3 btn btn-secondary "
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
              <form onSubmit={submitHanlder}>
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="feeconsult" className="col-form-label">
                      Fee Consult
                    </label>
                  </div>
                  <div className="col mb-2">
                    <input
                      type="text"
                      className="form-control col"
                      id="feeconsult"
                      name="feeconsult"
                      defaultValue={feeConsultQuery && feeConsultQuery?.data}
                    />
                  </div>
                  <div className="col">
                    <button
                      className="w-50 mb-2 btn btn-xs rounded-3 btn btn-secondary "
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default PrincipleView;
