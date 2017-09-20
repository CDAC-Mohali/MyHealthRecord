var method = ValidationService.prototype;

function ValidationService() {
    // console.log("Initializing SMS Service");
}

method.CheckErrorMessage = function(err) {
    var errString = "";
    //  console.log(err);
    for (var errName in err) {
        //     console.log(err[errName].message);
        errString += (err[errName].message.split(",")[0]);
    }
    errString = errString.replace("Validation failed:", "");
    errString = (errString.split(":")[1]);
    return errString;
};

method.GetStatusByCode = function(Code) {
    var Status = "Something went wrong.";
    switch (Code) {
        case "OT11":
            {
                Status = "Aadhaar number does not exist.";
                break;
            }
        case "110":
            {
                Status = "Aadhaar number does not have verified mobile/email.";
                break;
            }
        case "111":
            {
                Status = " Aadhaar number does not have verified mobile.";
                break;
            }
        case "112":
            {
                Status = "Aadhaar number does not have both email and mobile.";
                break;
            }
        case "510":
            {
                Status = "Invalid “Otp” XML format.";
                break;
            }
        case "520":
            {
                Status = "Invalid device.";
                break;
            }

        case "521":
            {
                Status = "Invalid mobile number.";
                break;
            }

        case "522":
            {
                Status = "Invalid “type” attribute.";
                break;
            }
        case "530":
            {
                Status = "Invalid AUA code.";
                break;
            }
        case "540":
            {
                Status = "Invalid OTP XML version.";
                break;
            }
        case "542":
            {
                Status = "AUA not authorized for ASA.   This error will be returned if AUA and ASA do not have linking in the portal.";
                break;
            }
        case "543":
            {
                Status = "Sub-AUA not associated with “AUA”.  This error will be returned if Sub-AUA specified in “sa” attribute is not added as “Sub-AUA” in portal.";
                break;
            }
        case "565":
            {
                Status = "AUA License key has expired or is invalid.";
                break;
            }
        case "566":
            {
                Status = "ASA license key has expired or is invalid.";
                break;
            }
        case "569":
            {
                Status = "Digital signature verification failed.";
                break;
            }
        case "570":
            {
                Status = "Invalid key info in digital signature (this means that certificate used for signing the OTP request is not valid – it is either expired, or does not belong to the AUA or is not created by a CA).";
                break;
            }
        case "940":
            {
                Status = " Unauthorized ASA channel.";
                break;
            }
        case "941":
            {
                Status = "Unspecified ASA channel.";
                break;
            }
        case "950":
            {
                Status = "Could not generate and/or send OTP.";
                break;
            }
        case "996":
            {
                Status = "Aadhaar Cancelled.";
                break;
            }
        case "997":
            {
                Status = "Aadhaar Suspended.";
                break;
            }
        case "998":
            {
                Status = "Invalid Aadhaar Number or Non Availability of Aadhaar data.";
                break;
            }
        case "999":
            {
                Status = "Unknown error.";
                break;
            }
        case "KS18":
            {
                Status = "Aadhaar Services not Responding."; //Aadhaar Internal error
                break;
            }
        case "K-100":
            {
                Status = "Resident authentication failed.";
                break;
            }
        case "K-200":
            {
                Status = "Resident data currently not available.";
                break;
            }
        case "K-540":
            {
                Status = "Invalid KYC XML.";
                break;
            }
        case "K-541":
            {
                Status = "Invalid e-KYC API version.";
                break;
            }
        case "K-542":
            {
                Status = "Invalid resident consent (“rc” attribute in “Kyc” element).";
                break;
            }
        case "K-544":
            {
                Status = "Invalid resident auth type (“ra” attribute in “Kyc” element does not match what is in PID block).";
                break;
            }
        case "K-545":
            {
                Status = "Resident has opted-out of this service. This feature is not implemented currently.";
                break;
            }
        case "K-546":
            {
                Status = "Invalid value for “pfr” attribute.";
                break;
            }
        case "K-547":
            {
                Status = "Invalid value for “wadh” attribute within PID block.";
                break;
            }
        case "K-550":
            {
                Status = "Invalid Uses Attribute.";
                break;
            }
        case "K-551":
            {
                Status = "Invalid “Txn” namespace.";
                break;
            }
        case "K-552":
            {
                Status = "Invalid License key.";
                break;
            }
        case "K-569":
            {
                Status = "Digital signature verification failed for e-KYC XML.";
                break;
            }
        case "K-570":
            {
                Status = "Invalid key info in digital signature for e-KYC XML (it is either expired, or does not belong to the AUA or is not created by a well-known Certification Authority)";
                break;
            }
        case "K-600":
            {
                Status = "AUA is invalid or not an authorized KUA.";
                break;
            }
        case "K-601":
            {
                Status = "ASA is invalid or not an authorized ASA.";
                break;
            }
        case "K-602":
            {
                Status = "KUA encryption key not available.";
                break;
            }
        case "K-603":
            {
                Status = "ASA encryption key not available.";
                break;
            }
        case "K-604":
            {
                Status = "ASA Signature not allowed.";
                break;
            }
        case "K-605":
            {
                Status = "Neither KUA key nor ASA encryption key are available.";
                break;
            }
        case "K-955":
            {
                Status = "Technical Failure.";
                break;
            }
        case "K-999":
            {
                Status = "Unknown error.";
                break;
            }


        default:
            break;

    }
    return Status;
}

module.exports = ValidationService;