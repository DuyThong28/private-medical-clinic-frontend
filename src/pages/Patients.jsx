import "./Patients.scss";

function PatientsPage() {
  return (
    <>
      <div className="d-flex flex-row">
        <div className="list">
          <div className="row g-3">
            <div className="col d-flex flex-column input">
              <label htmlFor="patientname" className="form-label">
                Patient name
              </label>
              <input
                type="text"
                className="form-control"
                id="patientname"
                name="patientname"
              />
            </div>
            <div className="col d-flex flex-column input">
              <label htmlFor="phonenumber" className="form-label">
                Phone number
              </label>
              <input
                type="text"
                className="form-control"
                id="phonenumber"
                name="phonenumber"
              />
            </div>
            <div className="col d-flex flex-column input">
              <button type="button" className="btn btn-primary">
                Add Patient
              </button>
            </div>
          </div>

          <div>
    <table className="table table-hover">
    <thead>
    <tr>
      <th scope="col">Patient name</th>
      <th scope="col">phone number</th>
      <th scope="col">Gender</th>
      <th scope="col">Birth Year</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
    <tr>
    <td>John Doe</td> <td>(555) 555-1234</td> <td>Male</td> <td>1980-01-01</td> <td>
      <a href="#">Edit</a> | <a href="#">Delete</a> </td>
    </tr>
  </tbody>
    </table>
          </div>
        </div>
        <div className="info">


        </div>
      </div>
    </>
  );
}

export default PatientsPage;
