using System.Net;
using System.Text;
using System.Text.Json.Nodes;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using AWSLambda1.Models;
using Newtonsoft.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace AWSLambda1;
public class Function
{
    public async Task<APIGatewayProxyResponse> Get(JsonObject request, ILambdaContext context) //APIGatewayProxyRequest
    {
             
        context.Logger.LogInformation("Get Request\n");

        var rsp = new SaphetyModel
        {
            IsValid = true,
            Warnings = new List<string>(),
            Errors = new List<string>(),
            ResultData = new List<string>(),
            ResultCode = 0
        };

        var toreturn = new APIGatewayProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Body = System.Text.Json.JsonSerializer.Serialize(rsp),
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };

        try
        {
            var body = request["body"];
            if (body != default)
            {
                BodyModel credentials = JsonConvert.DeserializeObject<BodyModel>(body.ToString() ?? "") ?? new BodyModel();
                if (string.IsNullOrEmpty(credentials.userName))
                {
                    rsp.IsValid = false;
                    rsp.Errors = new List<string>() { "userName not found" };
                    rsp.ResultData = new List<string>() { "The parameter userName is required" };
                    rsp.ResultCode = (int)HttpStatusCode.BadRequest;
                    toreturn.StatusCode = (int)HttpStatusCode.BadRequest;
                    toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
                    return toreturn;
                }

                if (string.IsNullOrEmpty(credentials.password))
                {
                    rsp.IsValid = false;
                    rsp.Errors = new List<string>() { "password not found" };
                    rsp.ResultData = new List<string>() { "The parameter password is required" };
                    rsp.ResultCode = (int)HttpStatusCode.BadRequest;
                    toreturn.StatusCode = (int)HttpStatusCode.BadRequest;
                    toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
                    return toreturn;
                }
               
                //var url = "https://api-factura-electronica-co.saphety.com/v2/auth/gettoken";
                //using (var client = new HttpClient())
                //{
                //    var jsonContent = new StringContent(JsonConvert.SerializeObject(new
                //    {
                //        userName = credentials.userName ?? "",
                //        password = credentials.password ?? "",
                //        virtual_operator = ""
                //    }), Encoding.UTF8, "application/json");

                //    var result = await client.PostAsync(url, jsonContent);
                //    //if (!result.IsSuccessStatusCode)
                //    //{
                //    //    var errorResult = await result.Content.ReadAsStringAsync();
                //    //    var errorresponse = JsonConvert.DeserializeObject<SaphetyModel>(errorResult ?? "") ?? new SaphetyModel();
                //    //    return $" {errorresponse.Errors}";
                //    //}

                //    //var jsonResult = await result.Content.ReadAsStringAsync();
                //    //var response = JsonConvert.DeserializeObject<SaphetyModel>(jsonResult ?? "") ?? new SaphetyModel();
                //    //if (response.IsValid)
                //    //{
                //    //    var data = JsonConvert.SerializeObject(response.ResultData);
                //    //    TokenModel token = JsonConvert.DeserializeObject<TokenModel>(data ?? "") ?? new TokenModel();
                //    //    return token.access_token;
                //    //}
                //    //else
                //    //{
                //    //    return $" {response.Errors}";
                //    //}
                //}

                    
                rsp.IsValid = true;
                rsp.Errors = new List<string>();
                rsp.ResultData = "Ok";
                rsp.ResultCode = (int)HttpStatusCode.OK;
                toreturn.StatusCode = (int)HttpStatusCode.OK;
                toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
                return toreturn;

            }
            else
            {
                rsp.IsValid = false;
                rsp.Errors = new List<string>() { "{userName:string,password:string}" };
                rsp.ResultData = new List<string>() { "Please send the identifications parameters" };
                rsp.ResultCode = (int)HttpStatusCode.BadRequest;
                toreturn.StatusCode = (int)HttpStatusCode.BadRequest;
                toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
                return toreturn;
            }
        }
        catch(Exception ex)
        {
            rsp.IsValid = false;
            rsp.Errors = new List<string>() { ex.ToString() };
            rsp.ResultData = new List<string>() { "Error" };
            rsp.ResultCode = (int)HttpStatusCode.BadRequest;
            toreturn.StatusCode = (int)HttpStatusCode.BadRequest;
            toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
            return toreturn;
        }

        

        //if (!result.IsSuccessStatusCode)
        //{
        //    var errorResult = await result.Content.ReadAsStringAsync();
        //    var errorresponse = JsonConvert.DeserializeObject<SaphetyModel>(errorResult ?? "") ?? new SaphetyModel();

        //    rsp.IsValid = false;
        //    rsp.Errors = errorresponse.Errors;
        //    rsp.ResultData = new List<string>() { "Error" };
        //    rsp.ResultCode = (int)HttpStatusCode.BadRequest;
        //    toreturn.StatusCode = (int)HttpStatusCode.BadRequest;
        //    toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
        //    return toreturn;
        //}

        //var jsonResult = await result.Content.ReadAsStringAsync();
        //var response = JsonConvert.DeserializeObject<SaphetyModel>(jsonResult ?? "") ?? new SaphetyModel();
        //if (response.IsValid)
        //{
        //    var data = JsonConvert.SerializeObject(response.ResultData);
        //    TokenModel token = JsonConvert.DeserializeObject<TokenModel>(data ?? "") ?? new TokenModel();
        //    rsp.IsValid = true;
        //    rsp.Errors = new List<string>();
        //    rsp.ResultData = token.access_token;
        //    rsp.ResultCode = (int)HttpStatusCode.OK;
        //    toreturn.StatusCode = (int)HttpStatusCode.OK;
        //    toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
        //    return toreturn;
        //}
        //else
        //{
        //    rsp.IsValid = false;
        //    rsp.Errors = response.Errors;
        //    rsp.ResultData = new List<string>() { "Error" };
        //    rsp.ResultCode = (int)HttpStatusCode.BadRequest;
        //    toreturn.StatusCode = (int)HttpStatusCode.BadRequest;
        //    toreturn.Body = System.Text.Json.JsonSerializer.Serialize(rsp);
        //    return toreturn;
        //}

    }   
}