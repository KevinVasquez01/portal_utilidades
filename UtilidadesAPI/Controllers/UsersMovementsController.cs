using System;
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
    public class UsersMovementsController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public UsersMovementsController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/UsersMovements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsersMovement>>> GetUsersMovements()
        {
            return await _context.UsersMovements.ToListAsync(); 
        }

        // GET: api/UsersMovements/5
        [HttpGet("{from}")]
        public async Task<ActionResult<IEnumerable<UsersMovement>>> GetUsersMovement(DateTime from)
        {
            var usersMovement = await _context.UsersMovements.Where(x=> x.Date <= from).ToListAsync();

            if (usersMovement == null)
            {
                return NotFound();
            }

            return usersMovement;
        }

        // PUT: api/UsersMovements/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsersMovement(int id, UsersMovement usersMovement)
        {
            if (id != usersMovement.Id)
            {
                return BadRequest();
            }

            _context.Entry(usersMovement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersMovementExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/UsersMovements
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UsersMovement>> PostUsersMovement(UsersMovement usersMovement)
        {
            usersMovement.Date = DateTime.UtcNow.AddHours(-5);
            _context.UsersMovements.Add(usersMovement);
            await _context.SaveChangesAsync();

            return new ObjectResult(usersMovement) { StatusCode = 200 };
        }

        private bool UsersMovementExists(int id)
        {
            return _context.UsersMovements.Any(e => e.Id == id);
        }
    }
}
