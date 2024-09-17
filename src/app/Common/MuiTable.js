import React from 'react'
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here

import FileDownloadIcon from '@mui/icons-material/FileDownload';

const MuiTable = ({ headerData, columnData, options }) => {
    const data = columnData
    const columns = headerData;

     const csvHeaders = columns.map(column => ({
    label: column.header || column.customHeader, // Use customHeader if available, otherwise use the default Header
    key: column.accessorKey,
  }));
    const csvConfig = mkConfig({
        columnHeaders: csvHeaders,
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        documentTitle:"download"
      });

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
      };

    const table = useMaterialReactTable({
        columns, // header date
        data,// columndata    
        renderTopToolbarCustomActions: ({ table }) => (
            <div><Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>Export </Button></div>
        ),
        enableClickToCopy: true,
        ...options
    });

    return (
        <div>
            <MaterialReactTable
                table={table}
                
            />
        </div>
    )
}

export default MuiTable
