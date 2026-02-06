import { Medicine } from "../lib/firestore";

interface Props {
  medicines?: Medicine[];
}

export default function MedicinesTable({ medicines = [] }: Props) {
  return (
    <table border={1} cellPadding={10} width="100%">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Toggle</th>
        </tr>
      </thead>
      <tbody>
        {medicines.length === 0 ? (
          <tr>
            <td colSpan={3} align="center">
              No medicines found
            </td>
          </tr>
        ) : (
          medicines.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.status}</td>
              <td>
                <input type="checkbox" checked={m.status === "Available"} readOnly />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}