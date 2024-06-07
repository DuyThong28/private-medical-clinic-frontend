import "./MainInput.scss";

export default function MainInput({
  name,
  isEditable,
  defaultValue,
  label,
  type,
}) {
  return (
    <div className="col">
      <label
        htmlFor={name}
        className="col-form-label  text-dark"
        style={{ fontWeight: 600 }}
      >
        {label}
      </label>
      <div className={isEditable ? "" : "input-visible"}>
        <input
          className="form-control"
          type={type ?? "text"}
          name={name}
          id={name}
          defaultValue={defaultValue}
          required
        ></input>
      </div>
      <div className={!isEditable ? "" : "input-visible"}>
        <p>{defaultValue}</p>
      </div>
    </div>
  );
}
