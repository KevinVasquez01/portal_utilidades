using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UtilidadesDB_DataAccess.Models;

namespace UtilidadesAPI.Controllers
{
    [Route("UtilidadesAPI/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public ProfilesController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/Profiles/5
        [HttpGet("{email}")]
        public async Task<ActionResult<UsersProfile>> GetProfile(string email)
        {
            var profile = await _context.UsersProfiles.Where(x => x.User.ToLower() == email.ToLower()).FirstOrDefaultAsync();           

            if (profile == default)
            {
                UsersProfile newprofile = new UsersProfile();
                newprofile.User = email.ToLower();
                newprofile.Profile = "guest";
                return newprofile;
            }           

            return profile;
        }

        // GET: api/Profiles/5
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<UsersProfile>>> GetProfiles()
        {
            return await _context.UsersProfiles.ToListAsync();
        }
    }
}