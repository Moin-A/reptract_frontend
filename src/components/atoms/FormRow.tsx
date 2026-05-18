export function FormRow({ columns, mb = 16, children }: {
  columns: string;
  mb?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: columns, gap: 16, marginBottom: mb }}>
      {children}
    </div>
  );
}
