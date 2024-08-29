using System.ComponentModel.DataAnnotations;
using System.Text;
using APIReporting.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace APIReporting.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        [HttpGet()]        
        public async Task<JsonResult> GetCompaniesAsync(string userName, [DataType(DataType.Password)] string password, string? virtual_operator)
        {
            try
            {
                var tokenController = new TokenController();
                string token = await tokenController.GetToken(userName, password, virtual_operator);
                if (string.IsNullOrWhiteSpace(token.Substring(0, 1)))
                {
                    throw new ArgumentException($"Error al obtener token:{token}");
                }

                var url = "https://api-factura-electronica-co.saphety.com/v2/virtualOperators/search";
                using (var client = new HttpClient())
                {
                    var jsonContent = new StringContent(JsonConvert.SerializeObject(new
                    {
                        Id = "",
                        SortField = "-CreationDate",
                        Alias = ""
                    }), Encoding.UTF8, "application/json");

                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                    var result = await client.PostAsync(url, jsonContent);
                    if (!result.IsSuccessStatusCode)
                    {
                        throw new ArgumentException("Error al consultar Operadores Virtuales");
                    }

                    var jsonResult = await result.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<SaphetyStruct>(jsonResult ?? "") ?? new SaphetyStruct();
                    if (response.IsValid)
                    {
                        var data = JsonConvert.SerializeObject(response.ResultData);
                        List<VirtualOperator> OVs = JsonConvert.DeserializeObject<List<VirtualOperator>>(data ?? "") ?? new List<VirtualOperator>();

                        List<Company> companiestoReturn = new List<Company>();

                        Task[] tasks = new Task[OVs.Count];
                        for (int i = 0; i < OVs.Count; i++)
                        {
                            tasks[i] = ConsultCompanies(OVs[i].Alias, token);
                        }
                        await Task.WhenAll(tasks);

                        foreach (var task in tasks)
                        {
                            var CompaniesResults = ((Task<List<Company>>)task).Result;
                            companiestoReturn.AddRange(CompaniesResults);
                        }

                        //foreach (var ov in OVs)
                        //{

                        //    var CompaniesResults = await ConsultCompanies(ov.Alias, token);
                        //    companiestoReturn.AddRange(CompaniesResults);

                        //    //count++;
                        //    //if(count >= 9)
                        //    //{
                        //    //    break;
                        //    //}                            
                        //}

                        //var CompaniesResults = await ConsultCompanies("saphety", token);
                        //companiestoReturn.AddRange(CompaniesResults);

                        JsonResult toreturn = new JsonResult(companiestoReturn);
                        return toreturn;
                    }
                    else
                    {
                        JsonResult toreturn = new JsonResult(new List<Company>());
                        return toreturn;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.ToString());            
            }
        }

        private async Task<List<Company>> ConsultCompanies(string OVAlias, string token)
        {
            try
            {
                var url = $"https://api-factura-electronica-co.saphety.com/v2/{OVAlias}/companies/search";
                using (var client = new HttpClient())
                {
                    var jsonContent = new StringContent(JsonConvert.SerializeObject(new
                    {
                        NumberOfRecords = 9999,
                        SortField = "-CreationDate",
                        Offset = 0,
                        DocumentNumber = "",
                        Name = ""
                    }), Encoding.UTF8, "application/json");

                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                    var result = await client.PostAsync(url, jsonContent);
                    if (!result.IsSuccessStatusCode)
                    {
                        throw new ArgumentException("Error al consultar Empresa ");
                    }

                    var jsonResult = await result.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<SaphetyStruct>(jsonResult ?? "") ?? new SaphetyStruct();
                    if (response.IsValid)
                    {
                        var data = JsonConvert.SerializeObject(response.ResultData);
                        List<Company> Companies = JsonConvert.DeserializeObject<List<Company>>(data ?? "") ?? new List<Company>();
                        return Companies;
                    }
                    else
                    {
                        return new List<Company>();
                    }
                }
            }
            catch
            {
                return new List<Company>();
            }
        }
    
       
    }
}
