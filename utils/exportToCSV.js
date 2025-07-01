export const exportToCSV = (data, filename = 'export') => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row =>
      Object.values(row).map(value => `"${(value ?? '').toString().replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
