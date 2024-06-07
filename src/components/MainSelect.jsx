import "./MainInput.scss";

export default function MainSelect({
  name,
  isEditable,
  defaultValue,
  label,
  options,
  text,
}) {
  return (
    <div className="col">
      <label
        htmlFor={name}
        className="col-form-label text-dark"
        style={{ fontWeight: 600 }}
      >
        {label}
      </label>
      <div className={isEditable ? "" : "input-visible"}>
        <select
          className="form-select"
          name="diagnostic"
          id="diagnostic"
          required
          defaultValue={defaultValue}
          visibility={isEditable ? "visible" : "hidden"}
        >
          {options}
        </select>
      </div>
      <div className={!isEditable ? "" : "input-visible"}>
        <p>{text}</p>
      </div>
    </div>
  );
}
