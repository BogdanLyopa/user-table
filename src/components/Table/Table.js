import users from "../../db.json";
import "./Table.css";

export default function Table({ items }) {
  return (
    <table>
      <thead>
        <tr>
          {items.map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((row) => (
          <tr>
            {items.map((column) => (
              <td key={row[column]}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
