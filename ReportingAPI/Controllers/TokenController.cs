using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ReportingAPI.Models;
using System.Text;

namespace ReportingAPI.Controllers
{
    public class TokenController : ControllerBase
    {
        public async Task<string> GetToken(string userName, string password, string? virtual_operator)
        {
            try
            {
                var url = "https://api-factura-electronica-co.saphety.com/v2/auth/gettoken";
                using (var client = new HttpClient())
                {
                    var jsonContent = new StringContent(JsonConvert.SerializeObject(new
                    {
                        userName = userName,
                        password = password,
                        virtual_operator = virtual_operator ?? ""
                    }), Encoding.UTF8, "application/json");

                    var result = await client.PostAsync(url, jsonContent);
                    if (!result.IsSuccessStatusCode)
                    {
                        var errorResult = await result.Content.ReadAsStringAsync();
                        var errorresponse = JsonConvert.DeserializeObject<SaphetyStruct>(errorResult ?? "") ?? new SaphetyStruct();
                        return $" {errorresponse.Errors}";
                    }

                    var jsonResult = await result.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<SaphetyStruct>(jsonResult ?? "") ?? new SaphetyStruct();
                    if (response.IsValid)
                    {
                        var data = JsonConvert.SerializeObject(response.ResultData);
                        Token token = JsonConvert.DeserializeObject<Token>(data ?? "") ?? new Token();
                        return token.access_token;
                    }
                    else
                    {
                        return $" {response.Errors}";
                    }
                }
            }
            catch (Exception ex)
            {
                return $" {ex}";
            }
        }
    }
}
