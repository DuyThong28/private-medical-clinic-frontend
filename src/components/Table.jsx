export default function Table({theader, tbody}){
    return <div>
        <div
        className="row list-group-item list-group-item-primary list-group-item-action d-flex flex-row w-100 fw-bold"
        style={{ padding: "8px 15px", color: "#1B59F8" }}
      >
       {theader}
      </div>
      <div className="row w-100 h-100 overflow-y-scroll">
      {tbody}
      </div>
    </div>
}