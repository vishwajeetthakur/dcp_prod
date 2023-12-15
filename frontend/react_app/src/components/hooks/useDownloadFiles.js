import react from 'react';
import axios from 'axios';

const useDownloadFiles = () => {
  const downloadFile = async ({
    url = '',
    method = 'post',
    data = {},
    fileName = 'csv.xlsx',
  }) => await axios({
    url,
    method,
    data,
    responseType: 'blob', // important
  }).then((response) => {
    url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', fileName);

    document.body.appendChild(link);

    link.click();
  });

  return downloadFile;
};

export default useDownloadFiles;