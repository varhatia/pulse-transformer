import React, { useState, useEffect } from 'react';
import logo from './Calm.png';
import './App.css';
import axios from 'axios';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import TableSortLabel from '@material-ui/core/TableSortLabel';

function App() {
  const [active_customers, setActive_Customers] = useState(0);
  const [active_BPs, setActive_BPs] = useState(0);
  const [running_APPs, setRunningAPPs] = useState(0);
  const [provisioning_APPs, setProvisioningAPPs] = useState(0);
  const [managed_VM, setManagedVMs] = useState(0);
  const [active_AHV_VMs, setActiveAHVVMs] = useState(0);
  const [active_AWS_VMs, setActiveAWSVMs] = useState(0);
  const [active_VMWare_VMs, setActiveVMWareVMs] = useState(0);
  // const [active_GCP_VMs, setActiveGCPVMs] = useState(0);
  const [active_Existing_VMs, setActiveExistingVMs] = useState(0);
  const [licensed_unique_VMs, setLicensedUniqueVMs] = useState(0);
  const [licenses_required, setLicensesRequired] = useState(0);
  const [avg_adoption, setAvgAdoption] = useState(0);
  
  const [qtrRows, setQtrRows] = useState([]);
  const [providerQtrRows, setProviderQtrRows] = useState([]);
  const [calmVersionRows, setCalmVersionRows] = useState([]);
  const [softDeleteRows, setSoftDeleteRows] = useState([]);
  const [publicAccountRows, setPublicAccountRows] = useState([]);
  const [adoptionRateRows, setAdoptionRateRows] = useState([]);

  const [withinRange, setWithinRange] = useState(0);
  
  const [index, setIndex] = useState(4);
  // const [file, setFile] = useState({});
  
  const handleSubmit = event => {
    event.preventDefault();
    fetchData();
  };

  // const handleUploadImage = event => {
  //   event.preventDefault();
    
  //   console.log("File is", {file})
    
  //   const data = new FormData();
  // data.append('filename', {});
  //   data.append('file', {file});
    
  //   axios.post("http://localhost:5000/upload", data, { // receive two parameter endpoint url ,form data 
  //     })
  //     .then(res => { // then print response status
  //       console.log(res.statusText)
  //     })

  //   // fetch('http://localhost:5000/upload', {
  //   //   method: 'POST',
  //   //   body: file,
  //   // }).then((response) => {
  //   //   response.json().then((body) => {
  //   //     console.log("Upload successful!!!")
  //   //   });
  //   // });
  // }
  
  const useStyles = makeStyles({
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
      width: '100%',
    },
    container: {
      maxHeight: 300,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  });
  
  const classes = useStyles();
  
  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }));

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  async function fetchData() {
    console.log(index)
    const { data } = await axios.get('http://localhost:5000/getReportedDataSinceDays/'+index)
    setWithinRange(data["Within Range"])
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
      // setActiveGCPVMs(data.active_GCP_VMs);
      setActiveExistingVMs(data.active_Existing_VMs);
      setLicensedUniqueVMs(data.licensed_unique_VMs);
      setLicensesRequired(data.licenses_required);
      setAvgAdoption(data.avg_adoption);
    });

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

    fetch('/getAdoption').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setAdoptionRateRows(tRows)
    })

    fetch('/getCalmVersionDistro').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setCalmVersionRows(tRows)
    })

    fetch('/getSoftDeleteCustomers').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setSoftDeleteRows(tRows)
    })

    fetch('/getPublicAccounts').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setPublicAccountRows(tRows)
    })

    fetch('/getReportedDataSinceDays/'+index).then(res => res.json()).then(data => {
      setWithinRange(data["Within Range"])
    })

  }, []);


  //Adoption Table
  const [adoptionRateOrder, setAdoptionRateOrder] = React.useState('asc');
  const [adoptionRateOrderBy, setAdoptionRateOrderBy] = React.useState('calories');
  const [adoptionRatePage, setAdoptionRatePage] = React.useState(0);
  const [adoptionRateDense, setAdoptionRateDense] = React.useState(false);
  const [rowsPerAdoptionRatePage, setRowsPerAdoptionRatePage] = React.useState(5);

  const adoptionRateTableCells = [
    { id: 'Name', numeric: false, disablePadding: false, label: 'Customer' },
    { id: 'Value', numeric: true, disablePadding: false, label: '% Adoption' },
  ];

  function AdoptionRateTableHead(props) {
    const { classes, adoptionRateOrder, adoptionRateOrderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {adoptionRateTableCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={adoptionRateOrderBy === headCell.id ? adoptionRateOrder : false}
            >
              <TableSortLabel
                active={adoptionRateOrderBy === headCell.id}
                direction={adoptionRateOrderBy === headCell.id ? adoptionRateOrder : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {adoptionRateOrderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {adoptionRateOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  AdoptionRateTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    adoptionRateOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
    adoptionRateOrderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const AdoptionRateTableToolbar = (props) => {
    const classes = useToolbarStyles();
  
    return (
      <Toolbar>
        {
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Customer vs Adoption Rate
          </Typography>
        }
      </Toolbar>
    );
  };
  
  AdoptionRateTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestAdoptionRateSort = (event, property) => {
    const isAsc = adoptionRateOrderBy === property && adoptionRateOrder === 'asc';
    setAdoptionRateOrder(isAsc ? 'desc' : 'asc');
    setAdoptionRateOrderBy(property);
  };

  const handleChangeAdoptionRatePage = (event, newPage) => {
    setAdoptionRatePage(newPage);
  };

  const handleChangeRowsPerAdoptionRatePage = (event) => {
    setRowsPerAdoptionRatePage(parseInt(event.target.value, 10));
    setAdoptionRatePage(0);
  };

  const handleChangeAdoptionRateDense = (event) => {
    setAdoptionRateDense(event.target.checked);
  };

  const emptyAdoptionRateRows = rowsPerAdoptionRatePage - Math.min(rowsPerAdoptionRatePage, adoptionRateRows.length - adoptionRatePage * rowsPerAdoptionRatePage);

  //Calm Version Distribution  Table
  const [calmVersionOrder, setCalmVersionOrder] = React.useState('asc');
  const [calmVersionOrderBy, setCalmVersionOrderBy] = React.useState('calories');
  const [calmVersionPage, setCalmVersionPage] = React.useState(0);
  const [calmVersionDense, setCalmVersionDense] = React.useState(false);
  const [rowsPerCalmVersionPage, setRowsPerCalmVersionPage] = React.useState(5);

  const calmVersionTableCells = [
    { id: 'Version_Name', numeric: false, disablePadding: false, label: 'Version Number' },
    { id: 'Value', numeric: true, disablePadding: false, label: 'Count' },
  ];

  function CalmVersionTableHead(props) {
    const { classes, calmVersionOrder, calmVersionOrderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {calmVersionTableCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={calmVersionOrderBy === headCell.id ? calmVersionOrder : false}
            >
              <TableSortLabel
                active={calmVersionOrderBy === headCell.id}
                direction={calmVersionOrderBy === headCell.id ? calmVersionOrder : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {calmVersionOrderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {calmVersionOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  CalmVersionTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    calmVersionOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
    calmVersionOrderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const CalmVersionTableToolbar = (props) => {
    const classes = useToolbarStyles();
  
    return (
      <Toolbar>
        {
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Calm Version vs Customers
          </Typography>
        }
      </Toolbar>
    );
  };
  
  CalmVersionTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestCalmVersionSort = (event, property) => {
    const isAsc = calmVersionOrderBy === property && calmVersionOrder === 'asc';
    setCalmVersionOrder(isAsc ? 'desc' : 'asc');
    setCalmVersionOrderBy(property);
  };

  const handleChangeCalmVersionPage = (event, newPage) => {
    setCalmVersionPage(newPage);
  };

  const handleChangeRowsPerCalmVersionPage = (event) => {
    setRowsPerCalmVersionPage(parseInt(event.target.value, 10));
    setCalmVersionPage(0);
  };

  const handleChangeCalmVersionDense = (event) => {
    setCalmVersionDense(event.target.checked);
  };

  const emptyCalmVersionRows = rowsPerCalmVersionPage - Math.min(rowsPerCalmVersionPage, calmVersionRows.length - calmVersionPage * rowsPerCalmVersionPage);

  //Soft Delete Table
  const [softDeleteOrder, setSoftDeleteOrder] = React.useState('asc');
  const [softDeleteOrderBy, setSoftDeleteOrderBy] = React.useState('calories');
  const [softDeletePage, setSoftDeletePage] = React.useState(0);
  const [softDeleteDense, setSoftDeleteDense] = React.useState(false);
  const [rowsPerSoftDeletePage, setRowsPerSoftDeletePage] = React.useState(5);

  const softDeleteTableCells = [
    { id: 'Customer', numeric: false, disablePadding: false, label: 'Customer' },
    { id: 'Cluster_ID', numeric: false, disablePadding: false, label: 'PC Cluster ID' },
    { id: 'Active_AHV_VMs', numeric: true, disablePadding: false, label: 'Active AHV VMs' },
    { id: 'Total_AHV_VMs', numeric: true, disablePadding: false, label: 'Total AHV VMs' },
    { id: 'Running_App', numeric: true, disablePadding: false, label: 'Running App' },
    { id: 'Percent_InUse', numeric: true, disablePadding: false, label: 'In Use (%)' },
  ];

  function SoftDeleteTableHead(props) {
    const { classes, softDeleteOrder, softDeleteOrderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {softDeleteTableCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={softDeleteOrderBy === headCell.id ? softDeleteOrder : false}
            >
              <TableSortLabel
                active={softDeleteOrderBy === headCell.id}
                direction={softDeleteOrderBy === headCell.id ? softDeleteOrder : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {softDeleteOrderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {softDeleteOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  SoftDeleteTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    softDeleteOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
    softDeleteOrderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const SoftDeleteTableToolbar = (props) => {
    const classes = useToolbarStyles();
  
    return (
      <Toolbar>
        {
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Customers using Soft Delete
          </Typography>
        }
      </Toolbar>
    );
  };
  
  SoftDeleteTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };
  
  const handleRequestSoftDeleteSort = (event, property) => {
    const isAsc = softDeleteOrderBy === property && softDeleteOrder === 'asc';
    setSoftDeleteOrder(isAsc ? 'desc' : 'asc');
    setSoftDeleteOrderBy(property);
  };

  const handleChangeSoftDeletePage = (event, newPage) => {
    setSoftDeletePage(newPage);
  };

  const handleChangeRowsPerSoftDeletePage = (event) => {
    setRowsPerSoftDeletePage(parseInt(event.target.value, 10));
    setSoftDeletePage(0);
  };

  const handleChangeSoftDeleteDense = (event) => {
    setSoftDeleteDense(event.target.checked);
  };

  const emptySoftDeleteRows = rowsPerSoftDeletePage - Math.min(rowsPerSoftDeletePage, softDeleteRows.length - softDeletePage * rowsPerSoftDeletePage);

  //Public Account Table
  const [publicAccountOrder, setpublicAccountOrder] = React.useState('asc');
  const [publicAccountOrderBy, setpublicAccountOrderBy] = React.useState('calories');
  const [publicAccountPage, setPublicAccountPage] = React.useState(0);
  const [publicAccountDense, setPublicAccountDense] = React.useState(false);
  const [rowsPerPublicAccountPage, setRowsPerPublicAccountPage] = React.useState(5);

  const publicAccountTableCells = [
    { id: 'Customer', numeric: false, disablePadding: false, label: 'Customer' },
    { id: 'AWS', numeric: true, disablePadding: false, label: 'AWS Account' },
    { id: 'AZURE', numeric: true, disablePadding: false, label: 'AZURE Account' },
    { id: 'GCP', numeric: true, disablePadding: false, label: 'GCP Account' },
  ];

  function PublicAccountTableHead(props) {
    const { classes, publicAccountOrder, publicAccountOrderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {publicAccountTableCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={publicAccountOrderBy === headCell.id ? publicAccountOrder : false}
            >
              <TableSortLabel
                active={publicAccountOrderBy === headCell.id}
                direction={publicAccountOrderBy === headCell.id ? publicAccountOrder : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {publicAccountOrderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {publicAccountOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  PublicAccountTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    publicAccountOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
    publicAccountOrderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  
  const PublicAccountTableToolbar = (props) => {
    const classes = useToolbarStyles();
  
    return (
      <Toolbar>
        {
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Customers vs Public Cloud
          </Typography>
        }
      </Toolbar>
    );
  };
  
  PublicAccountTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestPublicAccountSort = (event, property) => {
    const isAsc = publicAccountOrderBy === property && publicAccountOrder === 'asc';
    setpublicAccountOrder(isAsc ? 'desc' : 'asc');
    setpublicAccountOrderBy(property);
  };

  const handleChangePublicAccountPage = (event, newPage) => {
    setPublicAccountPage(newPage);
  };

  const handleChangeRowsPerPublicAcccountPage = (event) => {
    setRowsPerPublicAccountPage(parseInt(event.target.value, 10));
    setPublicAccountPage(0);
  };

  const handleChangePublicAccountDense = (event) => {
    setPublicAccountDense(event.target.checked);
  };

  const emptyPublicAccountRows = rowsPerPublicAccountPage - Math.min(rowsPerPublicAccountPage, publicAccountRows.length - publicAccountPage * rowsPerPublicAccountPage);
 
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={logo} className="App-logo" alt="logo" align="left" ></img>
        </div>
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
                  <label><strong>{withinRange}</strong> Active customers reported data within last <strong>{index}</strong> weeks </label>
                  <br></br>
                  <br></br>
                  <label>Customize weeks </label>
                  <input
                  value={index}
                  label="Enter X "
                  onChange={event => setIndex(event.target.value)}
                  />
                  <button>Submit</button>
                {/* <h3>Within Range Customers : {withinRange}</h3> */}
              </form>
            </TableCell>
            </TableRow> 
            <TableRow>
              <TableCell>
                <div className={classes.root}>
                  <Paper className={classes.paper}>
                  <AdoptionRateTableToolbar/>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={adoptionRateDense ? 'small' : 'medium'}
                      aria-label="enhanced table"
                    >
                      <AdoptionRateTableHead
                        classes={classes}
                        adoptionRateOrder={adoptionRateOrder}
                        adoptionRateOrderBy={adoptionRateOrderBy}
                        onRequestSort={handleRequestAdoptionRateSort}
                        rowCount={adoptionRateRows.length}
                      />
                      <TableBody>
                        {stableSort(adoptionRateRows, getComparator(adoptionRateOrder, adoptionRateOrderBy))
                          .slice(adoptionRatePage * rowsPerAdoptionRatePage, adoptionRatePage * rowsPerAdoptionRatePage + rowsPerAdoptionRatePage)
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.Name}
                              >
                                <TableCell component="th" id={labelId} scope="row">
                                  {row.Name}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Value}
                                </TableCell>
                                </TableRow>
                            );
                          })}
                        {emptyAdoptionRateRows > 0 && (
                          <TableRow style={{ height: (adoptionRateDense ? 33 : 53) * emptyAdoptionRateRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={adoptionRateRows.length}
                    rowsPerPage={rowsPerAdoptionRatePage}
                    page={adoptionRatePage}
                    onChangePage={handleChangeAdoptionRatePage}
                    onChangeRowsPerPage={handleChangeRowsPerAdoptionRatePage}
                  />
                  </Paper>
                  <FormControlLabel
                  control={<Switch checked={adoptionRateDense} onChange={handleChangeAdoptionRateDense} />}
                  label="Dense padding"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.root}> 
                  <Paper className={classes.paper}>
                  <CalmVersionTableToolbar/>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={calmVersionDense ? 'small' : 'medium'}
                      aria-label="enhanced table"
                    >
                      <CalmVersionTableHead
                        classes={classes}
                        calmVersionOrder={calmVersionOrder}
                        calmVersionOrderBy={calmVersionOrderBy}
                        onRequestSort={handleRequestCalmVersionSort}
                        rowCount={calmVersionRows.length}
                      />
                      <TableBody>
                        {stableSort(calmVersionRows, getComparator(calmVersionOrder, calmVersionOrderBy))
                          .slice(calmVersionPage * rowsPerCalmVersionPage, calmVersionPage * rowsPerCalmVersionPage + rowsPerCalmVersionPage)
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.Cluster_ID}
                              >
                                <TableCell component="th" id={labelId} scope="row">
                                  {row.Version_Name}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Value}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyCalmVersionRows > 0 && (
                          <TableRow style={{ height: (calmVersionDense ? 33 : 53) * emptyCalmVersionRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={calmVersionRows.length}
                    rowsPerPage={rowsPerCalmVersionPage}
                    page={calmVersionPage}
                    onChangePage={handleChangeCalmVersionPage}
                    onChangeRowsPerPage={handleChangeRowsPerCalmVersionPage}
                  />
                  </Paper>
                  <FormControlLabel
                  control={<Switch checked={calmVersionDense} onChange={handleChangeCalmVersionDense} />}
                  label="Dense padding"
                  />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Paper>
                  <h3>QoQ VMs, BPs, Apps growth</h3>
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
                <h3>QoQ Providers growth</h3>
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
                <Bar dataKey="GCP" stackId="a" fill="#d88584" />
                </BarChart>
                </Paper>
              </TableCell>
            </TableRow> 
            <TableRow>
              <TableCell>
                <div className={classes.root}>
                  <Paper className={classes.paper}>
                  <SoftDeleteTableToolbar/>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={softDeleteDense ? 'small' : 'medium'}
                      aria-label="enhanced table"
                    >
                      <SoftDeleteTableHead
                        classes={classes}
                        softDeleteOrder={softDeleteOrder}
                        softDeleteOrderBy={softDeleteOrderBy}
                        onRequestSort={handleRequestSoftDeleteSort}
                        rowCount={softDeleteRows.length}
                      />
                      <TableBody>
                        {stableSort(softDeleteRows, getComparator(softDeleteOrder, softDeleteOrderBy))
                          .slice(softDeletePage * rowsPerSoftDeletePage, softDeletePage * rowsPerSoftDeletePage + rowsPerSoftDeletePage)
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.Cluster_ID}
                              >
                                <TableCell component="th" id={labelId} scope="row">
                                  {row.Customer}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Cluster_ID}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Active_AHV_VMs}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Total_AHV_VMs}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Running_App}
                                </TableCell>
                                <TableCell align="right">
                                  {row.Percent_InUse}
                                </TableCell>
                                </TableRow>
                            );
                          })}
                        {emptySoftDeleteRows > 0 && (
                          <TableRow style={{ height: (softDeleteDense ? 33 : 53) * emptySoftDeleteRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={softDeleteRows.length}
                    rowsPerPage={rowsPerSoftDeletePage}
                    page={softDeletePage}
                    onChangePage={handleChangeSoftDeletePage}
                    onChangeRowsPerPage={handleChangeRowsPerSoftDeletePage}
                  />
                  </Paper>
                  <FormControlLabel
                  control={<Switch checked={softDeleteDense} onChange={handleChangeSoftDeleteDense} />}
                  label="Dense padding"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.root}>
                  <Paper className={classes.paper}>
                  <PublicAccountTableToolbar/>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={publicAccountDense ? 'small' : 'medium'}
                      aria-label="enhanced table"
                    >
                      <PublicAccountTableHead
                        classes={classes}
                        publicAccountOrder={publicAccountOrder}
                        publicAccountOrderBy={publicAccountOrderBy}
                        onRequestSort={handleRequestPublicAccountSort}
                        rowCount={publicAccountRows.length}
                      />
                      <TableBody>
                        {stableSort(publicAccountRows, getComparator(publicAccountOrder, publicAccountOrderBy))
                          .slice(publicAccountPage * rowsPerPublicAccountPage, publicAccountPage * rowsPerPublicAccountPage + rowsPerPublicAccountPage)
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.name}
                              >
                                <TableCell component="th" id={labelId} scope="row">
                                  {row.Customer}
                                </TableCell>
                                <TableCell align="right">{row.AWS}</TableCell>
                                <TableCell align="right">{row.AZURE}</TableCell>
                                <TableCell align="right">{row.GCP}</TableCell>
                                </TableRow>
                            );
                          })}
                        {emptyPublicAccountRows > 0 && (
                          <TableRow style={{ height: (publicAccountDense ? 33 : 53) * emptyPublicAccountRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={publicAccountRows.length}
                    rowsPerPage={rowsPerPublicAccountPage}
                    page={publicAccountPage}
                    onChangePage={handleChangePublicAccountPage}
                    onChangeRowsPerPage={handleChangeRowsPerPublicAcccountPage}
                  />
                  </Paper>
                  <FormControlLabel
                  control={<Switch checked={publicAccountDense} onChange={handleChangePublicAccountDense} />}
                  label="Dense padding"
                  />
                </div>
              </TableCell>
            </TableRow>
           </TableBody>     
        </Table>
      </header>
    </div>
    
  );
}

export default App 