import React from "react";
import "./DataDisplay.css";


const DataDisplay = () => {
  const data = [
    { id: 1, name: "John Doe", role: "Administrator", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Editor", status: "Active" },
    { id: 3, name: "Alex Brown", role: "Viewer", status: "Inactive" },
  ];

  return (
    <div className="data-section">
      <h2>Data Display Components</h2>

      {}
      <table data-testid="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.role}</td>
              <td>{person.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {}
      <div className="cards">
        {data.map((item) => (
          <div className="card" key={item.id} data-testid={`card-${item.id}`}>
            <h3>{item.name}</h3>
            <p>Role: {item.role}</p>
            <p>Status: {item.status}</p>
          </div>
        ))}
      </div>

      {}
      <div className="image-section">
        <h3>Image Example</h3>
        <img
          data-testid="image"
          src="https://picsum.photos/100"
          alt="Placeholder example"
          width="100"
          height="100"
        />
        <p className="img-desc">This image is used to test visibility and attributes.</p>
      </div>
    </div>
  );
};

export default DataDisplay;
