import React, { useState, useEffect } from 'react';
import logo from './Calm.png';
import './App.css';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,CartesianGrid, Legend,
} from 'recharts';

import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import CsvDownload from 'react-json-to-csv';

import { forwardRef } from 'react';

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
  const [paid_customers, setPaidCustomers] = useState(0);
  const [paid_customers_list, setPaidCustomersList] = useState([]);
  const [licensed_unique_VMs, setLicensedUniqueVMs] = useState(0);
  const [licenses_required, setLicensesRequired] = useState(0);
  const [licenses_sold, setLicensesSold] = useState(0);
  const [cores_sold, setCoresSold] = useState(0);
  const [avg_term, setAvgTerm] = useState(0);
  const [pulse_paid, setPulsePaid] = useState(0);
  const [g2k, setG2K] = useState(0);
  const [avg_adoption, setAvgAdoption] = useState(0);
  
  const [qtrRows, setQtrRows] = useState([]);
  const [custData, setCustData] = useState([]);
  const [custCalmVersion, setCustCalmVersion] = useState(0);
  const [custLicensesPurchased, setCustLicensesPurchased] = useState(0);
  const [custSupportCases, setCustSupportCases] = useState(0);
  const [custLastReportedDate, setCustLastReportedDate] = useState(0);
  const [custAdoption, setCustAdoption] = useState(0);

  const [providerQtrRows, setProviderQtrRows] = useState([]);
  const [calmVersionRows, setCalmVersionRows] = useState([]);
  const [softDeleteRows, setSoftDeleteRows] = useState([]);
  const [publicAccountRows, setPublicAccountRows] = useState([]);
  const [adoptionRateRows, setAdoptionRateRows] = useState([]);
  const [licenseRows, setLicenseRows] = useState([]);
  const [trialRows, setTrialRows] = useState([]);

  const [supportRows, setSupportRows] = useState([]);
  const [withinRange, setWithinRange] = useState(0);
  
  const [index, setIndex] = useState(4);
  const [custName, setCustName] = useState();
  const [lastPulseTime, setLastPulseTime] = useState();
  const [lastSFDCTime, setLastSFDCTime] = useState();
  // const [file, setFile] = useState({});
  
  const handleSubmit = event => {
    event.preventDefault();
    fetchData();
  };

  const handleCustomerChart = event => {
    // event.preventDefault();
    console.log(event.value);
    getCustomerDetails(event.value);
  };

  
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

  async function fetchData() {
    console.log(index)
    const { data } = await axios.get('http://localhost:5000/getReportedDataSinceDays/'+index)
    setWithinRange(data["Within Range"])
  };

  async function getCustomerDetails(custName) {
    console.log(custName)
    setCustName(custName)
    await axios.get('http://localhost:5000/getCustomerDetails/'+custName).then(data => {
      var rows = []
      // var tRows = []
      console.log(data)
      
      rows = Object.values(data.data["Customer Details"])
      setCustData(rows)
    });

    // await axios.get('http://localhost:5000/getCustomerExtraDetails/'+custName).then(data => {
    const {data} = await axios.get('http://localhost:5000/getCustomerExtraDetails/'+custName)
    console.log(data)
    
    setCustCalmVersion(data["Version"])
    setCustLicensesPurchased(data["Licenses"])
    setCustSupportCases(data["SupportCases"])
    setCustLastReportedDate(data["ReportedDate"])
    setCustAdoption(data["Adoption"])
  };


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
      setPaidCustomers(data.paid_customers);
      setLicensedUniqueVMs(data.licensed_unique_VMs);
      setLicensesRequired(data.licenses_required);
      setLicensesSold(data.licenses_sold);
      setCoresSold(data.cores_sold)

      setAvgTerm(data.avg_term);
      setPulsePaid(data.pulse_paid);
      setG2K(data.g2K_customers);
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

    fetch('/getCustomerDetails/William hill us').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setCustData(tRows)
    })

    fetch('/getCustomerExtraDetails/William hill us').then(res => res.json()).then(data => {
      console.log(data)
      setCustCalmVersion(data["Version"])
      setCustLicensesPurchased(data["Licenses"])
      setCustSupportCases(data["SupportCases"])
      setCustLastReportedDate(data["ReportedDate"])
      setCustAdoption(data["Adoption"])
      
    })

    fetch('/getLicenseData').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setLicenseRows(tRows)
    })

    fetch('/getTrialData').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setTrialRows(tRows)
      
    })

    fetch('/getSupportData').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setSupportRows(tRows)
    })

    fetch('/getPaidCustomersList').then(res => res.json()).then(data => {
      var rows = []
      var tRows = []
      console.log(data)
      
      rows = Object.values(data)
      rows[0].map(item => tRows.push(item))
      setPaidCustomersList(tRows)
    })

    fetch('/getAverageAdoption').then(res => res.json()).then(data => {
      setAvgAdoption(data.avg_adoption);
    })

    fetch('/getLastPulseUpdateTime').then(res => res.json()).then(data => {
      setLastPulseTime(data["Pulse Update Time"]);
    }) 
    
    fetch('/getLastSFDCUpdateTime').then(res => res.json()).then(data => {
      setLastSFDCTime(data["SFDC Update Time"]);
    }) 
  }, []);

  //Adoption Table
  const [AdoptionRate, setAdoptionRate] = React.useState({
    columns: [
      { title: 'Customer', field: 'Name' },
      { title: 'Licenses', field: 'QTY', type: 'numeric' },
      { title: 'Adoption (%)', field: 'Value', type: 'numeric' },
    ],
  });
  
  //Calm Version Distribution  Table
  const [CalmVersionDistro, setCalmVersionDistro] = React.useState({
    columns: [
      { title: 'Version', field: 'Version_Name' },
      { title: 'Count', field: 'Value', type: 'numeric' },
    ],
  });

  //Soft Delete Table
  const [SoftDelete, setSoftDelete] = React.useState({
    columns: [
      { title: 'Customer', field: 'Customer' },
      // { title: 'Cluster_ID', field: 'Cluster_ID'},
      { title: 'Active VMs', field: 'Active_AHV_VMs', type: 'numeric' },
      { title: 'Total VMs', field: 'Total_AHV_VMs', type: 'numeric' },
      { title: 'Running APPs', field: 'Running_App', type: 'numeric' },
      { title: 'In use (%)', field: 'Percent_InUse', type: 'numeric' }
    ],
  });

  //Public Account Table
  const [PublicAccount, setPublicAccount] = React.useState({
    columns: [
      { title: 'Customer', field: 'Customer' },
      { title: 'AWS', field: 'AWS', type: 'numeric' },
      { title: 'AZURE', field: 'AZURE', type: 'numeric' },
      { title: 'GCP', field: 'GCP', type: 'numeric' }
    ],
  });

  //License Table
  const [License, setLicense] = React.useState({
    columns: [
      { title: 'Customer', field: 'CUSTOMER' },
      { title: 'Qtr', field: 'QTR_SOLD'},
      { title: 'SKU', field: 'SKU'},
      { title: 'Calm TCV ($)', field: 'CALM_TCV', type: 'numeric'},
      { title: 'Qty', field: 'QTY_SOLD', type: 'numeric' }
    ],
  });

  //Trial Table
  const [Trial, setTrial] = React.useState({
    columns: [
      { title: 'Customer', field: 'CUSTOMER' },
      { title: 'Version', field: 'Version'},
      { title: 'Latest', field: 'Date'},
      { title: 'VMs', field: 'VMs', type: 'numeric'}
    ],
  });

  //Support Table
  const [Support, setSupport] = React.useState({
    columns: [
      { title: 'Customer', field: 'Customer_Name' },
      { title: 'Paid', field: 'Paid'},
      { title: 'Latest', field: 'Date', type: 'datetime-local'},
      { title: 'Cases', field: 'Value', type: 'numeric'},
      
    ],
  });

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  const defaultOption = paid_customers_list[0];
  
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
                          Paid Customers (SFDC)
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {paid_customers}
                        </Typography>
                        </CardContent>
                      </Card>
                    </TableCell>
                   <TableCell align="left">
                   <Card className={classes.root} align="left">
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Active Customers (Pulse)
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
                          Paid Customers (Pulse)
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {pulse_paid}
                        </Typography>
                      </CardContent>
                    </Card>
                  </TableCell>
                  <TableCell align="left">
                    <Card className={classes.root} align="left">
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Licenses/Cores Sold (Lifetime)
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {licenses_sold} / {cores_sold}
                        </Typography>
                      </CardContent>
                    </Card>
                  </TableCell>
                  <TableCell align="left">
                    <Card className={classes.root} align="left">
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Avg Term
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {avg_term} yr
                        </Typography>
                      </CardContent>
                    </Card>
                  </TableCell>
                  <TableCell align="left">
                    <Card className={classes.root} align="left">
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          G2K Customers
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {g2k}
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
                  
                </TableRow>
                
              </TableCell>
            </TableRow>
            </TableBody>     
        </Table>
        <Table>
        <TableBody>
            <TableRow>
              <TableCell>
                <MaterialTable
                icons={tableIcons}
                title="Paid Customers & Purchase"
                columns={License.columns}
                data={licenseRows}
                />  
                <div>
                  <CsvDownload data={licenseRows}>Download License Data</CsvDownload>
                </div>
              </TableCell>
              <TableCell>
                <MaterialTable
                icons={tableIcons}
                title="Trial Customers"
                columns={Trial.columns}
                data={trialRows}
                />  
                <div>
                  <CsvDownload data={trialRows}>Download Trial Data</CsvDownload>
                </div>
              </TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell>
                <p>License data last updated at {lastSFDCTime}</p>
              </TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell>
                <MaterialTable
                  icons={tableIcons}
                  title="Paid Customers Adoption Rate (Active in last 6 months)"
                  columns={AdoptionRate.columns}
                  data={adoptionRateRows}
                />
                <div>
                  <CsvDownload data={adoptionRateRows}>Download Adoption Data</CsvDownload>
                </div>
              </TableCell>
              <TableCell>
                <MaterialTable
                  icons={tableIcons}
                  title="Calm Versions vs Customers"
                  columns={CalmVersionDistro.columns}
                  data={calmVersionRows}
                />
                <div>
                  <CsvDownload data={calmVersionRows}>Download Version Data</CsvDownload>
                </div>
              </TableCell>
            </TableRow>
              <TableRow>
                <TableCell>
                  <Paper>
                    <h3>Select Paid Customer for Details</h3>
                      <Dropdown options={paid_customers_list} onChange={handleCustomerChart} value={defaultOption} placeholder="Select an option" />
                      <br></br>
                      <LineChart
                    width={500}
                    height={300}
                    data={custData}
                    margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="APPs" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="BPs" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="VMs" stroke="#d8bb84" />
                  </LineChart>
                    </Paper>
                </TableCell>
                <TableCell>
                  <Paper>
                    <label><strong>Additional Details</strong></label>
                    <br></br><p> Last reported date <strong>{custLastReportedDate}</strong> weeks </p>
                    <p> Support cases Raised till date <strong>{custSupportCases}</strong> </p>
                    <p> Calm version in use <strong>{custCalmVersion}</strong> </p>
                    <p> Calm adoption is <strong>{custAdoption} %</strong> </p>
                    <p> Calm licenses purchased <strong>{custLicensesPurchased}</strong> </p>
                    <br></br>
                  </Paper>
                </TableCell>
              </TableRow> 
              <TableRow>
                <TableCell>
                  <Paper>
                    <label><b>Cumulative QoQ VMs, BPs, Apps growth</b></label>
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
                  <label><b>Cumulative QoQ Providers growth</b></label>
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
                {/* <TableCell>
                  <MaterialTable
                    icons={tableIcons}
                    title="Soft Delete Customers"
                    columns={SoftDelete.columns}
                    data={softDeleteRows}
                  />
                </TableCell> */}
                <TableCell>
                <MaterialTable
                icons={tableIcons}
                title="Support Cases"
                columns={Support.columns}
                data={supportRows}
                />  
                <div>
                  <CsvDownload data={supportRows}>Download Support Data</CsvDownload>
                </div>
                </TableCell>
                <TableCell>
                  <MaterialTable
                  icons={tableIcons}
                  title="Public Cloud Customers"
                  columns={PublicAccount.columns}
                  data={publicAccountRows}
                  />
                  <div>
                  <CsvDownload data={publicAccountRows}>Download Public Account Data</CsvDownload>
                </div>  
                </TableCell>
              </TableRow>
          </TableBody>     
        </Table>
      </header>
    </div>
  )
}

export default App 