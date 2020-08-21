import React, { useState, useEffect } from 'react';
import logo from './Calm.png';
import './App.css';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import PureComponent from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

function App() {
  const [active_customers, setActive_Customers] = useState(0);
  const [active_BPs, setActive_BPs] = useState(0);
  const [running_APPs, setRunningAPPs] = useState(0);
  const [provisioning_APPs, setProvisioningAPPs] = useState(0);
  const [managed_VM, setManagedVMs] = useState(0);
  const [active_AHV_VMs, setActiveAHVVMs] = useState(0);
  const [active_AWS_VMs, setActiveAWSVMs] = useState(0);
  const [active_VMWare_VMs, setActiveVMWareVMs] = useState(0);
  const [active_GCP_VMs, setActiveGCPVMs] = useState(0);
  const [active_Existing_VMs, setActiveExistingVMs] = useState(0);
  const [licensed_unique_VMs, setLicensedUniqueVMs] = useState(0);
  const [licenses_required, setLicensesRequired] = useState(0);
  const [avg_adoption, setAvgAdoption] = useState(0);
  const [rows, setRows] = useState([]);

  const [adoptionRows, setAdoptionRows] = useState([]);
  const [qtrRows, setQtrRows] = useState([]);
  const [providerQtrRows, setProviderQtrRows] = useState([]);
  const [withinRange, setWithinRange] = useState(0);
  
  const [index, setIndex] = useState(0);
  const [file, setFile] = useState({});

  const handleSubmit = event => {
    event.preventDefault();
    fetchData();
  };

  const handleUploadImage = event => {
    event.preventDefault();
    
    console.log("File is", {file})
    
    const data = new FormData();
    // data.append('filename', {});
    data.append('file', {file});
    
    axios.post("http://localhost:5000/upload", data, { // receive two parameter endpoint url ,form data 
      })
      .then(res => { // then print response status
        console.log(res.statusText)
      })

    // fetch('http://localhost:5000/upload', {
    //   method: 'POST',
    //   body: file,
    // }).then((response) => {
    //   response.json().then((body) => {
    //     console.log("Upload successful!!!")
    //   });
    // });
  }
  
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      flexGrow: 1,
      padding: 2
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    root: {
      // width: '100%',
    },
    container: {
      maxHeight: 300,
    },
  });
  
  const classes = useStyles();
  
  async function fetchData() {
    console.log(index)
    const { data } = await axios.get('http://localhost:5000/getReportedDataSinceDays/'+index)
    setWithinRange(data["Within Range"])
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // For adoption table
  const [page2, setPage2] = React.useState(0);
  const [rowsPerPage2, setRowsPerPage2] = React.useState(10);

  const handleChangePage2 = (event, newPage2) => {
    setPage2(newPage2);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(+event.target.value);
    setPage2(0);
  };
    
  const columns = [
    { id: 'name', label: 'Calm Version', minWidth: 100 },
    { id: 'code', label: 'Number', minWidth: 40 },
  ];

  const adoption_columns = [
    { id: 'custname', label: 'Customer Name', minWidth: 300 },
    { id: 'adoption', label: 'Adoption %', minWidth: 40 },
  ];
  
  function createVersionData(name, value) {
    return { name, value };
  }

  useEffect(() => {
    fetch('/getStats').then(res => res.json()).then(data => {
      setActive_Customers(data.active_customers);
      setActive_BPs(data.active_BPs);
      setRunningAPPs(data.running_APPs);
      setProvisioningAPPs(data.provisioning_APPs);
      setManagedVMs(data.managed_VM);
      setActiveAHVVMs(data.active_AHV_VMs);
      setActiveAWSVMs(data.active_AWS_VMs);
      setActiveVMWareVMs(data.active_VMWare_VMs);
      setActiveGCPVMs(data.active_GCP_VMs);
      setActiveExistingVMs(data.active_Existing_VMs);
      setLicensedUniqueVMs(data.licensed_unique_VMs);
      setLicensesRequired(data.licenses_required);
      setAvgAdoption(data.avg_adoption);
    });

    fetch('/getCalmVersionDistro').then(res => res.json()).then(data => {
      var rows = []
      console.log(data)
      Object.keys(data).map((key, i) => (
          rows.push(createVersionData({key}, data[key]))
      ));
      console.log(rows)
      setRows(rows)
    })

    fetch('/getAdoption').then(res => res.json()).then(data => {
      var rows = []
      console.log(data)
      Object.keys(data).map((key, i) => (
          rows.push(createVersionData({key}, data[key]))
      ));
      console.log(rows)
      setAdoptionRows(rows)
    })

    fetch('/getStatsByQtr').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setQtrRows(tRows)
    })

    fetch('/getProviderStatsByQtr').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setProviderQtrRows(tRows)
    })

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />


        <Table>
          <TableBody>
            <TableRow>
            <TableCell>
              <TableRow>
                <TableCell align="left">
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Active Customers 
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {active_customers}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell align="left">
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Active BPs
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {active_BPs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell>
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Running APPs
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {running_APPs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell>
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Provisionig APPs
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {provisioning_APPs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Card className={classes.root} align="left">
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Managed VMs
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {managed_VM}
                        </Typography>
                      </CardContent>
                    </Card>
                </TableCell>
                <TableCell align="left">
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Active AHV VMs
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {active_AHV_VMs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell>
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Active AWS VMs 
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {active_AWS_VMs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell>
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Active VMWare VMs
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {active_VMWare_VMs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Active Existing VMs
                      </Typography>
                      <Typography variant="h5" component="h2">
                          {active_Existing_VMs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell>
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Unique Licensed VMs
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {licensed_unique_VMs}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell align="left">
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Required Licenses
                      </Typography>
                      <Typography variant="h5" component="h2">
                          {licenses_required}
                      </Typography>
                    </CardContent>
                    </Card>
                </TableCell>
                <TableCell align="left">
                  <Card className={classes.root} align="left">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Average Adoption 
                      </Typography>
                      <Typography variant="h5" component="h2">
                          {avg_adoption} %
                      </Typography>
                    </CardContent>
                    </Card>
                </TableCell>
              </TableRow>
            </TableCell>
            <TableCell>
              {/* <form onSubmit={handleUploadImage}>
                <div>
                  <input type="file" name="file"
                  onChange={event => setFile(event.target.files[0])}
                  />
                </div>
                  <br />
                <div>
                  <button>Upload</button>
                </div>
              </form> */}
                <form onSubmit={handleSubmit}>
                  <label>Customer Data within X weeks old:</label>
                  <input
                  value={index}
                  label="Enter X  "
                  onChange={event => setIndex(event.target.value)}
                  defaule = "Enter X"
                  />
                  <button>Submit</button>
                <h3>Within Range Customers : {withinRange}</h3>
              </form>
            </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.name.key}>
                            <TableCell align="left">
                              {row.name.key}
                            </TableCell>
                            <TableCell align="left">
                              {row.value}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Paper>
              </TableCell>
              <TableCell>
                <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {adoption_columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                {adoptionRows.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.name.key}>
                      <TableCell align="left">
                        {row.name.key}
                      </TableCell>
                      <TableCell align="left">
                        {row.value}
                      </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div2"
                count={adoptionRows.length}
                rowsPerPage={rowsPerPage2}
                page={page2}
                onChangePage={handleChangePage2}
                onChangeRowsPerPage={handleChangeRowsPerPage2}
                />
                </Paper> 
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Paper>
                  <BarChart
                width={500}
                height={300}
                data={qtrRows}
                margin={{
                top: 20, right: 30, left: 20, bottom: 5,
                }}
                > 
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ActiveVMs" stackId="a" fill="#8884d8" />
                <Bar dataKey="BPs" stackId="a" fill="#82ca9d" />
                <Bar dataKey="APPs" stackId="a" fill="#d8bb84" />
                </BarChart>
                </Paper>
              </TableCell>
              <TableCell>
                <Paper>
                <BarChart
                width={500}
                height={300}
                data={providerQtrRows}
                margin={{
                top: 20, right: 30, left: 20, bottom: 5,
                }}
                > 
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="AHV" stackId="a" fill="#8884d8" />
                <Bar dataKey="VMWare" stackId="a" fill="#82ca9d" />
                <Bar dataKey="AWS" stackId="a" fill="#d8bb84" />
                <Bar dataKey="AZURE" stackId="a" fill="#d5d884" />
                {/* <Bar dataKey="GCP" stackId="a" fill="#d88584" /> */}
                </BarChart>
                </Paper>
              </TableCell>
            </TableRow>
          </TableBody>     
        </Table>
      </header>
    </div>
    
  );
}

export default App 