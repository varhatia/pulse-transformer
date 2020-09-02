import openpyxl
from openpyxl import load_workbook
from flask  import Flask, render_template, request, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import datetime 
from datetime import date, timedelta
from flask_cors import CORS, cross_origin
import math, json
from werkzeug.datastructures import ImmutableMultiDict
from werkzeug.utils import secure_filename
from flask import jsonify

app=Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:sherlock@localhost/pulse_collector'
app.config['CORS_HEADERS'] = 'Content-Type'
db=SQLAlchemy(app)

files_path="/Users/vishal.arhatia/pulse-transformer/"
quarter_to_show= "Q4'2020"
stats = {}
sinceDays = {}
adoption_records = []
version_records = []
statsByQtr = []
providerStatsByQtr = []
soft_Delete_Customers = []
public_accounts_records = []

if(db is None):
    print("DB not init")

class Data(db.Model):
    __tablename__="pulse_data"
    id = db.Column(db.Integer, primary_key=True)
    PC_Cluster_UUID = db.Column(db.String(120))
    Customer_Name = db.Column(db.String(120))
    Account_Theater = db.Column(db.String(120))
    PC_VERSION = db.Column(db.String(10))
    CALM_VERSION = db.Column(db.String(10))
    EPSILON_VERSION = db.Column(db.String(10))
    Last_Reported_Date = db.Column(db.Date)
    ACTIVE_BP = db.Column(db.Integer)
    RUNNING_APP = db.Column(db.Integer)
    PROVISIONING_APP = db.Column(db.Integer)
    ERROR_APP = db.Column(db.Integer)
    DELETED_APP = db.Column(db.Integer)
    TOTAL_MANAGED_VMS = db.Column(db.Integer)
    TOTAL_AHV_VMS = db.Column(db.Integer)
    TOTAL_AWS_VMS =	db.Column(db.Integer)
    TOTAL_VMWARE_VMS = db.Column(db.Integer)
    TOTAL_GCP_VMS = db.Column(db.Integer)
    TOTAL_AZURE_VMS = db.Column(db.Integer)
    TOTAL_EXISTING_VMS = db.Column(db.Integer)
    TOTAL_K8S_POD = db.Column(db.Integer)
    ACTIVE_AHV_VMS = db.Column(db.Integer)
    ACTIVE_AWS_VMS = db.Column(db.Integer)
    ACTIVE_VMWARE_VMS = db.Column(db.Integer)
    ACTIVE_GCP_VMS = db.Column(db.Integer)
    ACTIVE_AZURE_VMS = db.Column(db.Integer)
    ACTIVE_EXISTING_VMS = db.Column(db.Integer)
    ACTIVE_K8S_POD = db.Column(db.Integer)
    LICENSE_VMS_COUNTS = db.Column(db.Integer)
    LICENSE_UNIQUE_VMS_COUNT = db.Column(db.Integer)
    LICENSE_REQUIRED_PACKS = db.Column(db.Integer)      
    QUARTER = db.Column(db.String(10))
    ADOPTION = db.Column(db.Float) 
    PERCENT_VMs_INUSE = db.Column(db.Float)     
    AWS_ACCOUNT = db.Column(db.Integer)
    GCP_ACCOUNT = db.Column(db.Integer)
    AZURE_ACCOUNT = db.Column(db.Integer)
    VMWARE_ACCOUNT = db.Column(db.Integer)
    PUBLIC_ACCOUNT = db.Column(db.Integer)


    def __init__(self, PC_Cluster_UUID, Customer_Name, Account_Theater, PC_VERSION, CALM_VERSION, EPSILON_VERSION, Last_Reported_Date, ACTIVE_BP, RUNNING_APP, PROVISIONING_APP, ERROR_APP,
        DELETED_APP, TOTAL_MANAGED_VMS, TOTAL_AHV_VMS, TOTAL_AWS_VMS, TOTAL_VMWARE_VMS, TOTAL_GCP_VMS, TOTAL_AZURE_VMS, TOTAL_EXISTING_VMS, TOTAL_K8S_POD, ACTIVE_AHV_VMS,
        ACTIVE_AWS_VMS, ACTIVE_VMWARE_VMS, ACTIVE_GCP_VMS, ACTIVE_AZURE_VMS, ACTIVE_EXISTING_VMS, ACTIVE_K8S_POD, LICENSE_VMS_COUNTS, LICENSE_UNIQUE_VMS_COUNT, LICENSE_REQUIRED_PACKS, QUARTER, ADOPTION, PERCENT_VMs_INUSE,
        AWS_ACCOUNT, VMWARE_ACCOUNT, AZURE_ACCOUNT, GCP_ACCOUNT, PUBLIC_ACCOUNT):
        
        self.PC_Cluster_UUID = PC_Cluster_UUID
        self.Customer_Name = Customer_Name
        self.Account_Theater = Account_Theater
        self.PC_VERSION = PC_VERSION
        self.CALM_VERSION = CALM_VERSION
        self.EPSILON_VERSION = EPSILON_VERSION
        self.Last_Reported_Date = Last_Reported_Date
        self.ACTIVE_BP = ACTIVE_BP
        self.RUNNING_APP = RUNNING_APP
        self.PROVISIONING_APP = PROVISIONING_APP
        self.ERROR_APP = ERROR_APP
        self.DELETED_APP = DELETED_APP
        self.TOTAL_MANAGED_VMS = TOTAL_MANAGED_VMS
        self.TOTAL_AHV_VMS = TOTAL_AHV_VMS
        self.TOTAL_AWS_VMS = TOTAL_AWS_VMS
        self.TOTAL_VMWARE_VMS = TOTAL_VMWARE_VMS
        self.TOTAL_GCP_VMS = TOTAL_GCP_VMS
        self.TOTAL_AZURE_VMS = TOTAL_AZURE_VMS
        self.TOTAL_EXISTING_VMS = TOTAL_EXISTING_VMS
        self.TOTAL_K8S_POD = TOTAL_K8S_POD
        self.ACTIVE_AHV_VMS = ACTIVE_AHV_VMS
        self.ACTIVE_AWS_VMS = ACTIVE_AWS_VMS
        self.ACTIVE_VMWARE_VMS = ACTIVE_VMWARE_VMS
        self.ACTIVE_GCP_VMS = ACTIVE_GCP_VMS
        self.ACTIVE_AZURE_VMS = ACTIVE_AZURE_VMS
        self.ACTIVE_EXISTING_VMS = ACTIVE_EXISTING_VMS
        self.ACTIVE_K8S_POD = ACTIVE_K8S_POD
        self.LICENSE_VMS_COUNTS = LICENSE_VMS_COUNTS
        self.LICENSE_UNIQUE_VMS_COUNT = LICENSE_UNIQUE_VMS_COUNT
        self.LICENSE_REQUIRED_PACKS = LICENSE_REQUIRED_PACKS
        self.QUARTER = QUARTER
        self.ADOPTION = ADOPTION
        self.PERCENT_VMs_INUSE = PERCENT_VMs_INUSE
        self.AWS_ACCOUNT = AWS_ACCOUNT
        self.AZURE_ACCOUNT = AZURE_ACCOUNT
        self.VMWARE_ACCOUNT = VMWARE_ACCOUNT
        self.GCP_ACCOUNT = GCP_ACCOUNT
        self.PUBLIC_ACCOUNT = PUBLIC_ACCOUNT

        # wb = openpyxl.load_workbook('Calm_Customer_List.xlsx')
        # print(wb.sheetnames)

        # sheet = wb.active
        # print(sheet.title, sheet["A1"].value)

        #Coluwmn Names of the Table
        # PC_Cluster_UUID = sheet["A1"].value #1
        # Customer_Name = sheet["C1"].value	#3
        # Account_Theater	= sheet["F1"].value #6
        # PC_VERSION = sheet["I1"].value      #9
        # CALM_VERSION = sheet["J1"].value    #10
        # EPSILON_VERSION = sheet["K1"].value #11
        # Last_Reported_Date = sheet["L1"].value #12	
        # ACTIVE_BP = sheet["M1"].value       #13  
        # RUNNING_APP = sheet["Q1"].value	    #16
        # PROVISIONING_APP = sheet["R1"].value #18
        # ERROR_APP = sheet["S1"].value #19	
        # DELETED_APP = sheet["T1"].value	#20
        # TOTAL_MANAGED_VMS = sheet["U1"].value #21
        # TOTAL_AHV_VMS = sheet["V1"].value	#22
        # TOTAL_AWS_VMS =	sheet["W1"].value #23
        # TOTAL_VMWARE_VMS = sheet["X1"].value #24
        # TOTAL_GCP_VMS = sheet["Y1"].value #25
        # TOTAL_AZURE_VMS = sheet["Z1"].value #26
        # TOTAL_EXISTING_VMS = sheet["AA1"].value #27
        # TOTAL_K8S_POD = sheet["AB1"].value #28
        # ACTIVE_AHV_VMS = sheet["AC1"].value #29
        # ACTIVE_AWS_VMS = sheet["AD1"].value #30
        # ACTIVE_VMWARE_VMS = sheet["AE1"].value #31
        # ACTIVE_GCP_VMS = sheet["AF1"].value #32
        # ACTIVE_AZURE_VMS = sheet["AG1"].value #33
        # ACTIVE_EXISTING_VMS = sheet["AH1"].value #34
        # ACTIVE_K8S_POD = sheet["AI1"].value #35
        # LICENSE_VMS_COUNTS = sheet["AS1"].value #45
        # LICENSE_UNIQUE_VMS_COUNT = sheet["AT1"].value #46
        # LICENSE_REQUIRED_PACKS = sheet["AU1"].value #47                     

        # row_count = sheet.max_row
        # column_count = sheet.max_column

def quarter(i):
    switcher={
        1:'Q2',
        2:'Q3',
        3:'Q3',
        4:'Q3',
        5:'Q4',
        6:'Q4',
        7:'Q4',
        8:'Q1',
        9:'Q1',
        10: 'Q1',
        11: 'Q2',
        12: 'Q2'
    }
    return switcher.get(i)


@app.route("/")
def intialize():
    
    excelList = [files_path+"api/Calm_Customer_List_Q1'2020.xlsx", 
                 files_path+"api/Calm_Customer_List_Q2'2020.xlsx",
                 files_path+"api/Calm_Customer_List_Q3'2020.xlsx", 
                 files_path+"api/Calm_Customer_List_Q4'2020.xlsx"]
    
    for excel in excelList:

        wb = openpyxl.load_workbook(excel)
        # print(wb.sheetnames)

        sheet = wb.active
        row_count = sheet.max_row
        column_count = sheet.max_column
        
        # print("Sheet name", excel[-12:-5])

        #getQuarter from filename
        print("Quarter is : ", excel[-12:-5])
        QUARTER = excel[-12:-5]

        version_dict = {}

        for row in sheet.iter_rows(min_row=2, min_col=1, max_row=row_count, max_col=column_count):  
            #print("PC_Cluster_UUID : ", row[0].value) #1
            PC_Cluster_UUID = row[0].value
            
            #print("Customer_Name : ", row[2].value)
            Customer_Name = row[2].value
            
            #print("Account_Theater : ", row[5].value) #6
            Account_Theater = row[5].value

            #print("PC_VERSION : ", row[8].value)    #9
            PC_VERSION = row[8].value

            #print("CALM_VERSION : ", row[9].value)   #10
            CALM_VERSION = row[9].value
            
            #print("EPSILON_VERSION : ", row[10].value) #11
            EPSILON_VERSION = row[10].value

            #print("Last_Reported_Date : ", row[11].value) #12
            Last_Reported_Date = row[11].value
            if(Last_Reported_Date is not None):
                date = datetime.datetime.strptime(Last_Reported_Date, '%d-%m-%Y')
            else:
                date = ""
            
            #print("ACTIVE_BP : ", row[12].value)       #13  
            ACTIVE_BP = row[12].value

            #print("RUNNING_APP : ", row[16].value)	    #16
            RUNNING_APP = row[16].value

            #print("PROVISIONING_APP : ", row[17].value) #18
            PROVISIONING_APP = row[17].value

            #print("ERROR_APP : ", row[18].value) #19	
            ERROR_APP = row[18].value

            #print("DELETED_APP : ", row[19].value)	#20
            DELETED_APP = row[19].value

            #print("TOTAL_MANAGED_VMS : ", row[20].value) #21
            TOTAL_MANAGED_VMS = row[20].value

            #print("TOTAL_AHV_VMS : ", row[21].value)	#22
            TOTAL_AHV_VMS = row[21].value

            #print("TOTAL_AWS_VMS : ", row[22].value) #23
            TOTAL_AWS_VMS = row[22].value
            
            #print("TOTAL_VMWARE_VMS : ", row[23].value) #24
            TOTAL_VMWARE_VMS = row[23].value
            
            #print("TOTAL_GCP_VMS : ", row[24].value) #25
            TOTAL_GCP_VMS = row[24].value
            
            #print("TOTAL_AZURE_VMS : ", row[25].value) #26
            TOTAL_AZURE_VMS = row[25].value
            
            #print("TOTAL_EXISTING_VMS : ", row[26].value) #27
            TOTAL_EXISTING_VMS = row[26].value
            
            #print("TOTAL_K8S_POD : ", row[27].value) #28
            TOTAL_K8S_POD = row[27].value
            
            #print("ACTIVE_AHV_VMS : ", row[28].value) #29
            ACTIVE_AHV_VMS = row[28].value
            
            #print("ACTIVE_AWS_VMS : ", row[29].value) #30
            ACTIVE_AWS_VMS = row[29].value
            
            #print("ACTIVE_VMWARE_VMS : ", row[30].value) #31
            ACTIVE_VMWARE_VMS = row[30].value
            
            #print("ACTIVE_GCP_VMS : ", row[31].value) #32
            ACTIVE_GCP_VMS = row[31].value
            
            #print("ACTIVE_AZURE_VMS : ", row[32].value) #33
            ACTIVE_AZURE_VMS = row[32].value
            
            #print("ACTIVE_EXISTING_VMS : ", row[33].value) #34
            ACTIVE_EXISTING_VMS = row[33].value
            
            #print("ACTIVE_K8S_POD : ", row[34].value) #35
            ACTIVE_K8S_POD = row[34].value
            
            #print("AWS_ACCOUNT : ", row[35].value) #36
            AWS_ACCOUNT = row[35].value
            
            #print("VMWARE_ACCOUNT : ", row[36].value) #37
            VMWARE_ACCOUNT = row[36].value
            
            #print("GCP_ACCOUNT : ", row[37].value) #38
            GCP_ACCOUNT = row[37].value
            
            #print("AZURE_ACCOUNT : ", row[38].value) #39
            AZURE_ACCOUNT = row[38].value

            #print("LICENSE_VMS_COUNTS : ", row[44].value) #45
            LICENSE_VMS_COUNTS = row[44].value
            
            #print("LICENSE_UNIQUE_VMS_COUNT : ", row[45].value) #46
            LICENSE_UNIQUE_VMS_COUNT = row[45].value
            
            #print("LICENSE_REQUIRED_PACKS : ", row[46].value) #47                     
            LICENSE_REQUIRED_PACKS = row[46].value                 

            if(Customer_Name is not None):

                if(("Nutanix" in Customer_Name) or ("Ntnx" in Customer_Name)):
                    # print("Handling Ntnx acccounts. So skipping")
                    continue

                if(CALM_VERSION in version_dict):
                    x = version_dict[CALM_VERSION]
                    version_dict[CALM_VERSION] = x+1  
                else:
                    version_dict[CALM_VERSION] = 1
                
                # #current quarter
                # current_time = datetime.datetime.utcnow()
                # QUARTER = str(quarter(current_time.month)) + "'" + str(current_time.year)

                #Adoption
                if(LICENSE_REQUIRED_PACKS is not None):
                    if(LICENSE_REQUIRED_PACKS != 0):
                        ADOPTION = round((LICENSE_UNIQUE_VMS_COUNT/(LICENSE_REQUIRED_PACKS*25))*100,2)
                        
                    else:
                        ADOPTION = -1    
                else:
                    ADOPTION = -1

                #Softdelete
                if(TOTAL_AHV_VMS is not None):
                    if(TOTAL_AHV_VMS != 0):
                        PERCENT_VMs_INUSE = round((ACTIVE_AHV_VMS/TOTAL_AHV_VMS)*100,2)
                    
                    else:
                        PERCENT_VMs_INUSE = -1   
                else:
                    PERCENT_VMs_INUSE = -1
                
                #Public Account
                if(AWS_ACCOUNT > 0 or AZURE_ACCOUNT > 0 or GCP_ACCOUNT > 0):
                    PUBLIC_ACCOUNT = AWS_ACCOUNT + AZURE_ACCOUNT + GCP_ACCOUNT
                
                else:
                    PUBLIC_ACCOUNT = -1

                #Populate the Data
                data=Data(PC_Cluster_UUID, Customer_Name, Account_Theater, PC_VERSION, CALM_VERSION, EPSILON_VERSION, date, ACTIVE_BP, RUNNING_APP, PROVISIONING_APP, ERROR_APP, DELETED_APP, TOTAL_MANAGED_VMS, TOTAL_AHV_VMS, TOTAL_AWS_VMS, TOTAL_VMWARE_VMS, TOTAL_GCP_VMS, TOTAL_AZURE_VMS, TOTAL_EXISTING_VMS, TOTAL_K8S_POD, ACTIVE_AHV_VMS, ACTIVE_AWS_VMS, ACTIVE_VMWARE_VMS, ACTIVE_GCP_VMS, ACTIVE_AZURE_VMS, ACTIVE_EXISTING_VMS, ACTIVE_K8S_POD, LICENSE_VMS_COUNTS, LICENSE_UNIQUE_VMS_COUNT, LICENSE_REQUIRED_PACKS, QUARTER, ADOPTION, PERCENT_VMs_INUSE,
                AWS_ACCOUNT, VMWARE_ACCOUNT, AZURE_ACCOUNT, GCP_ACCOUNT, PUBLIC_ACCOUNT)
                
                db.session.add(data)
                print("Entered Data for customer : ", Customer_Name)    
        
        db.session.commit()

    populateStats()
    populateAdoption()
    populateCalmVersion()
    populateStatsByQtr()
    populateProviderStatsByQtr()
    populateSoftDeleteCustomers()
    populatePublicAccount()
    
    return ""

@app.route("/getStats", methods=['GET']) 
def getStats():
    if request.method=='GET':
        return stats


def populateStats():
    #This is for last quarter
    

    print(" Current Quarter is : %s " % quarter_to_show)

    num_of_active_customers = db.session.query(func.count(Data.Customer_Name)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Active Customers: %s " % num_of_active_customers)
    
    num_of_active_BPs = db.session.query(func.sum(Data.ACTIVE_BP)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Active BPs: %s " % num_of_active_BPs)

    num_of_running_APPs = db.session.query(func.sum(Data.RUNNING_APP)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Running APPs: %s " % num_of_running_APPs)
    
    num_of_provisioning_APPs = db.session.query(func.sum(Data.PROVISIONING_APP)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Provisioning APPs: %s " % num_of_provisioning_APPs)
    
    num_of_managed_VMs= db.session.query(func.sum(Data.TOTAL_MANAGED_VMS)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Managed VMs: %s " % num_of_managed_VMs)
    
    num_of_active_AHV_VMs = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Active AHV VMs: %s " % num_of_active_AHV_VMs)
    
    num_of_active_AWS_VMs = db.session.query(func.sum(Data.ACTIVE_AWS_VMS)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Active AWS VMs: %s " % num_of_active_AWS_VMs)
    
    num_of_active_VMWare_VMs = db.session.query(func.sum(Data.ACTIVE_VMWARE_VMS)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Active VMware VMs: %s " % num_of_active_VMWare_VMs)
    
    num_of_active_GCP_VMs = db.session.query(func.sum(Data.ACTIVE_GCP_VMS)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Active GCP VMs: %s " % num_of_active_GCP_VMs)
    
    num_of_active_Existing_VMs = db.session.query(func.sum(Data.ACTIVE_EXISTING_VMS)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total Active Existing VMs: %s " % num_of_active_Existing_VMs)
    
    num_of_licensed_unique_VMs = db.session.query(func.sum(Data.LICENSE_UNIQUE_VMS_COUNT)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total licenses unique VMs: %s " % num_of_licensed_unique_VMs)

    num_of_licenses_required = db.session.query(func.sum(Data.LICENSE_REQUIRED_PACKS)).filter(Data.QUARTER == quarter_to_show).scalar()
    print(" Total licenses required: %s " % num_of_licenses_required)

    average_adoption = db.session.query(func.avg(Data.ADOPTION)).filter(Data.ADOPTION != -1).filter(Data.QUARTER == quarter_to_show).scalar()

    print(average_adoption)
    print(type(average_adoption))
    print(round(average_adoption, 2))
    
    stats['active_customers'] = num_of_active_customers
    stats['active_BPs'] = num_of_active_BPs
    stats['running_APPs'] = num_of_running_APPs
    stats['provisioning_APPs'] = num_of_provisioning_APPs
    stats['managed_VM'] = num_of_managed_VMs
    stats['active_AHV_VMs'] = num_of_active_AHV_VMs
    stats['active_AWS_VMs'] = num_of_active_AWS_VMs
    stats['active_VMWare_VMs'] = num_of_active_VMWare_VMs
    stats['active_GCP_VMs'] = num_of_active_GCP_VMs
    stats['active_Existing_VMs'] = num_of_active_Existing_VMs
    stats['licensed_unique_VMs'] = num_of_licensed_unique_VMs 
    stats['licenses_required'] = num_of_licenses_required
    stats['avg_adoption'] = round(average_adoption, 2)
    

@app.route("/getAdoption", methods=['GET'])
def getAdoption():
    return jsonify({'adoption records': adoption_records})
    
def populateAdoption():
    #Prepare adoption Data
    records = db.session.query(Data).filter(Data.ADOPTION != -1).order_by(Data.ADOPTION.desc()).all()
    adoption_dict = {}

    for record in records:
        customer = record.Customer_Name

        if(record.ADOPTION != -1):
            adoption_dict[customer] = record.ADOPTION

    print(adoption_dict)
    sorted(adoption_dict.items(), key=lambda x: x[1], reverse=True)    
    print(adoption_dict)

    for key in adoption_dict:
        adoption_record = {}
        adoption_record["Name"] = key
        adoption_record["Value"] = adoption_dict[key]

        adoption_records.append(adoption_record)

    print(adoption_records)    

@app.route("/getCalmVersionDistro", methods=['GET'])
def getCalmVersionDistro():
    return jsonify({'version records': version_records})

def populateCalmVersion():
        #Prepare Calm Version records
    calm_versions_records = db.session.query(Data.Customer_Name, Data.CALM_VERSION).all()
    version_dict = {}

    for record in calm_versions_records:
        # print(record.__dict__)
        version = record.CALM_VERSION
        
        if(version in version_dict):
            num = version_dict[version]
            version_dict[version] = num+1
        elif(version is not None):
            version_dict[version] = 1

    print(version_dict)

    for key in version_dict:
        version_record = {}
        version_record["Version_Name"] = key
        version_record["Value"] = version_dict[key]
        
        version_records.append(version_record)

    print(version_records)

@app.route("/getStatsByQtr", methods=['GET']) 
def getStatsByQtr():
    if request.method=='GET':
        return jsonify({'statsByQtr': statsByQtr})

def populateStatsByQtr():
    num_of_active_bps_q1 = db.session.query(func.sum(Data.ACTIVE_BP)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Active BPs in Q1: %s " % num_of_active_bps_q1)
    
    num_of_active_bps_q2 = db.session.query(func.sum(Data.ACTIVE_BP)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_bps_q2)
    
    num_of_active_bps_q3 = db.session.query(func.sum(Data.ACTIVE_BP)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_bps_q3)

    num_of_active_bps_q4 = db.session.query(func.sum(Data.ACTIVE_BP)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_bps_q4)

    num_of_running_APPs_q1 = db.session.query(func.sum(Data.RUNNING_APP)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Running APPs in Q1: %s " % num_of_running_APPs_q1)
    
    num_of_running_APPs_q2 = db.session.query(func.sum(Data.RUNNING_APP)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Running APPs in Q2: %s " % num_of_running_APPs_q2)
    
    num_of_running_APPs_q3 = db.session.query(func.sum(Data.RUNNING_APP)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Running APPs in Q2: %s " % num_of_running_APPs_q2)

    num_of_running_APPs_q4 = db.session.query(func.sum(Data.RUNNING_APP)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Running APPs in Q2: %s " % num_of_running_APPs_q2)
    
    num_of_active_AHV_VMs_q1 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Active AHV VMs: %s " % num_of_active_AHV_VMs_q1)
    
    num_of_active_AHV_VMs_q2 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Active AHV VMs: %s " % num_of_active_AHV_VMs_q2)

    num_of_active_AHV_VMs_q3 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Active AHV VMs: %s " % num_of_active_AHV_VMs_q3)

    num_of_active_AHV_VMs_q4 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Active AHV VMs: %s " % num_of_active_AHV_VMs_q4)

    average_adoption_q1 = db.session.query(func.avg(Data.ADOPTION)).filter(Data.ADOPTION != -1).filter(Data.QUARTER == "Q1'2020").scalar()
    average_adoption_q2 = db.session.query(func.avg(Data.ADOPTION)).filter(Data.ADOPTION != -1).filter(Data.QUARTER == "Q2'2020").scalar()
    average_adoption_q3 = db.session.query(func.avg(Data.ADOPTION)).filter(Data.ADOPTION != -1).filter(Data.QUARTER == "Q3'2020").scalar()
    average_adoption_q4 = db.session.query(func.avg(Data.ADOPTION)).filter(Data.ADOPTION != -1).filter(Data.QUARTER == "Q4'2020").scalar()

    print(" Avg adoption Q1 : %s ", average_adoption_q1)
    print(" Avg adoption Q2 : %s ", average_adoption_q2)
    print(" Avg adoption Q3 : %s ", average_adoption_q3)
    print(" Avg adoption Q4 : %s ", average_adoption_q4)
    # import pdb; pdb.set_trace();
    # statsByQtr = []
    
    Q1Data = {}
    Q1Data["BPs"] = num_of_active_bps_q1
    Q1Data["APPs"] = num_of_running_APPs_q1
    Q1Data["ActiveVMs"] = num_of_active_AHV_VMs_q1
    Q1Data["name"] = "Q1'2020"

    Q2Data = {}
    Q2Data["BPs"] = num_of_active_bps_q2
    Q2Data["APPs"] = num_of_running_APPs_q2
    Q2Data["ActiveVMs"] = num_of_active_AHV_VMs_q2
    Q2Data["name"] = "Q2'2020"

    Q3Data = {}
    Q3Data["BPs"] = num_of_active_bps_q3
    Q3Data["APPs"] = num_of_running_APPs_q3
    Q3Data["ActiveVMs"] = num_of_active_AHV_VMs_q3
    Q3Data["name"] = "Q3'2020"

    Q4Data = {}
    Q4Data["BPs"] = num_of_active_bps_q4
    Q4Data["APPs"] = num_of_running_APPs_q4
    Q4Data["ActiveVMs"] = num_of_active_AHV_VMs_q4
    Q4Data["name"] = "Q4'2020"

    statsByQtr.append(Q1Data)
    statsByQtr.append(Q2Data)
    statsByQtr.append(Q3Data)
    statsByQtr.append(Q4Data)
    
    print(statsByQtr)


@app.route("/getProviderStatsByQtr", methods=['GET']) 
def getProviderStatsByQtr():
    if request.method=='GET':
        return jsonify({'finalrecord': providerStatsByQtr})

def populateProviderStatsByQtr():
    num_of_active_AHV_VMs_q1 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Active BPs in Q1: %s " % num_of_active_AHV_VMs_q1)

    num_of_active_VMWare_VMs_q1 = db.session.query(func.sum(Data.ACTIVE_VMWARE_VMS)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Active BPs in Q1: %s " % num_of_active_VMWare_VMs_q1)

    num_of_active_AWS_VMs_q1 = db.session.query(func.sum(Data.ACTIVE_AWS_VMS)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Active BPs in Q1: %s " % num_of_active_AWS_VMs_q1)

    num_of_active_AZURE_VMs_q1 = db.session.query(func.sum(Data.ACTIVE_AZURE_VMS)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Active BPs in Q1: %s " % num_of_active_AZURE_VMs_q1)

    num_of_active_GCP_VMs_q1 = db.session.query(func.sum(Data.ACTIVE_GCP_VMS)).filter(Data.QUARTER == "Q1'2020").scalar()
    print(" Total Active BPs in Q1: %s " % num_of_active_GCP_VMs_q1)

    num_of_active_AHV_VMs_q2 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_AHV_VMs_q1)

    num_of_active_VMWare_VMs_q2 = db.session.query(func.sum(Data.ACTIVE_VMWARE_VMS)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_VMWare_VMs_q1)

    num_of_active_AWS_VMs_q2 = db.session.query(func.sum(Data.ACTIVE_AWS_VMS)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_AWS_VMs_q1)

    num_of_active_AZURE_VMs_q2 = db.session.query(func.sum(Data.ACTIVE_AZURE_VMS)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_AZURE_VMs_q1)

    num_of_active_GCP_VMs_q2 = db.session.query(func.sum(Data.ACTIVE_GCP_VMS)).filter(Data.QUARTER == "Q2'2020").scalar()
    print(" Total Active BPs in Q2: %s " % num_of_active_GCP_VMs_q1)

    num_of_active_AHV_VMs_q3 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Active BPs in Q3: %s " % num_of_active_AHV_VMs_q1)

    num_of_active_VMWare_VMs_q3 = db.session.query(func.sum(Data.ACTIVE_VMWARE_VMS)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Active BPs in Q3: %s " % num_of_active_VMWare_VMs_q1)

    num_of_active_AWS_VMs_q3 = db.session.query(func.sum(Data.ACTIVE_AWS_VMS)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Active BPs in Q3: %s " % num_of_active_AWS_VMs_q1)

    num_of_active_AZURE_VMs_q3 = db.session.query(func.sum(Data.ACTIVE_AZURE_VMS)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Active BPs in Q3: %s " % num_of_active_AZURE_VMs_q1)

    num_of_active_GCP_VMs_q3 = db.session.query(func.sum(Data.ACTIVE_GCP_VMS)).filter(Data.QUARTER == "Q3'2020").scalar()
    print(" Total Active BPs in Q3: %s " % num_of_active_GCP_VMs_q1)

    num_of_active_AHV_VMs_q4 = db.session.query(func.sum(Data.ACTIVE_AHV_VMS)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Active BPs in Q4: %s " % num_of_active_AHV_VMs_q1)

    num_of_active_VMWare_VMs_q4 = db.session.query(func.sum(Data.ACTIVE_VMWARE_VMS)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Active BPs in Q4: %s " % num_of_active_VMWare_VMs_q1)

    num_of_active_AWS_VMs_q4 = db.session.query(func.sum(Data.ACTIVE_AWS_VMS)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Active BPs in Q4: %s " % num_of_active_AWS_VMs_q1)

    num_of_active_AZURE_VMs_q4 = db.session.query(func.sum(Data.ACTIVE_AZURE_VMS)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Active BPs in Q4: %s " % num_of_active_AZURE_VMs_q1)

    num_of_active_GCP_VMs_q4 = db.session.query(func.sum(Data.ACTIVE_GCP_VMS)).filter(Data.QUARTER == "Q4'2020").scalar()
    print(" Total Active BPs in Q4: %s " % num_of_active_GCP_VMs_q1)

    Q1Data = {}
    Q1Data["AHV"] = num_of_active_AHV_VMs_q1
    Q1Data["VMWare"] = num_of_active_VMWare_VMs_q1
    Q1Data["AWS"] = num_of_active_AWS_VMs_q1
    Q1Data["AZURE"] = num_of_active_AZURE_VMs_q1
    Q1Data["GCP"] = num_of_active_GCP_VMs_q1
    Q1Data["name"] = "Q1'2020"

    Q2Data = {}
    Q2Data["AHV"] = num_of_active_AHV_VMs_q2
    Q2Data["VMWare"] = num_of_active_VMWare_VMs_q2
    Q2Data["AWS"] = num_of_active_AWS_VMs_q2
    Q2Data["AZURE"] = num_of_active_AZURE_VMs_q2
    Q2Data["GCP"] = num_of_active_GCP_VMs_q2
    Q2Data["name"] = "Q2'2020"

    Q3Data = {}
    Q3Data["AHV"] = num_of_active_AHV_VMs_q3
    Q3Data["VMWare"] = num_of_active_VMWare_VMs_q3
    Q3Data["AWS"] = num_of_active_AWS_VMs_q3
    Q3Data["AZURE"] = num_of_active_AZURE_VMs_q3
    Q3Data["GCP"] = num_of_active_GCP_VMs_q3
    Q3Data["name"] = "Q3'2020"

    Q4Data = {}
    Q4Data["AHV"] = num_of_active_AHV_VMs_q4
    Q4Data["VMWare"] = num_of_active_VMWare_VMs_q4
    Q4Data["AWS"] = num_of_active_AWS_VMs_q4
    Q4Data["AZURE"] = num_of_active_AZURE_VMs_q4
    Q4Data["GCP"] = num_of_active_GCP_VMs_q4
    Q4Data["name"] = "Q4'2020"

    providerStatsByQtr.append(Q1Data)
    providerStatsByQtr.append(Q2Data)
    providerStatsByQtr.append(Q3Data)
    providerStatsByQtr.append(Q4Data)

    print(providerStatsByQtr)

@app.route("/getSoftDeleteCustomers", methods=['GET']) 
def getSoftDeleteCustomers():
    if request.method=='GET':
        return jsonify({'Soft Delete Customers': soft_Delete_Customers})

def populateSoftDeleteCustomers():
    records = db.session.query(Data.Customer_Name, Data.PC_Cluster_UUID, Data.ACTIVE_AHV_VMS, Data.TOTAL_AHV_VMS, Data.RUNNING_APP, Data.PERCENT_VMs_INUSE).filter(Data.QUARTER == quarter_to_show).filter(Data.PERCENT_VMs_INUSE > -1).all()
    print(" Soft Delete Customers are : %s " % records)

    for record in records:
        soft_delete_record = {}
        soft_delete_record["Customer"] = record.Customer_Name
        soft_delete_record["Cluster_ID"] = record.PC_Cluster_UUID
        soft_delete_record["Active_AHV_VMs"] = record.ACTIVE_AHV_VMS
        soft_delete_record["Total_AHV_VMs"] = record.TOTAL_AHV_VMS
        soft_delete_record["Running_App"] = record.RUNNING_APP
        soft_delete_record["Percent_InUse"] = record.PERCENT_VMs_INUSE
        
        soft_Delete_Customers.append(soft_delete_record)

    print(soft_Delete_Customers)

@app.route("/getPublicAccounts", methods=['GET']) 
def getPublicAccounts():
    if request.method=='GET':
        return jsonify({'Public Account Records': public_accounts_records})

def populatePublicAccount():
    records = db.session.query(Data.Customer_Name, Data.AWS_ACCOUNT, Data.AZURE_ACCOUNT, Data.GCP_ACCOUNT, Data.PUBLIC_ACCOUNT).filter(Data.QUARTER == quarter_to_show).filter(Data.PUBLIC_ACCOUNT > -1).all()
    print(" Public Account Customers are : %s " % records)

    for record in records:
        public_accounts_record = {}
        public_accounts_record["Customer"] = record.Customer_Name
        public_accounts_record["AWS"] = record.AWS_ACCOUNT
        public_accounts_record["AZURE"] = record.AZURE_ACCOUNT
        public_accounts_record["GCP"] = record.GCP_ACCOUNT
        public_accounts_record["PUBLIC_ACCOUNT"] = record.PUBLIC_ACCOUNT

        public_accounts_records.append(public_accounts_record)

    print(public_accounts_records)


@app.route("/getReportedDataSinceDays/<num>", methods=['GET'])
def getReportedDataSinceDays(num):
    current_time = datetime.datetime.utcnow()
    num_weeks_ago = current_time - datetime.timedelta(weeks=int(num))
    within_Range = db.session.query(Data).filter(Data.Last_Reported_Date > num_weeks_ago).count()
    customer_Count = db.session.query(func.count(Data.Customer_Name)).scalar()
    
    print(" Total Active Customers: %s " % customer_Count)
    print(" Within Range Data: %s " % within_Range)

    sinceDays = {}
    sinceDays['Within Range'] = within_Range

    return sinceDays


UPLOAD_FOLDER = '/Users/vishal.arhatia/pulse-transformer/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/upload", methods=['POST'])
@cross_origin(origin='http://localhost:5000',headers=['Content- Type','Authorization'])
def fileUpload():
    print("I am in fileupload")
    # works through postman
    # file = request.files['file']
    # filename = file.filename
    # print("File name", filename)
    # destination=UPLOAD_FOLDER+filename
    # print(destination)
    # file.save(destination)

    file = request.files['file']
    print("File : ", file)
    print(type(file))
    filename = secure_filename(file.filename)
    # filename = file.filename
    print("File name is : ", filename)
    # print()
    
    response="Whatever you wish too return"
    
    return response
    
if __name__=="__main__":
    app.run(debug=True)


