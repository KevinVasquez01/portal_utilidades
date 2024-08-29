using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UtilidadesDB_DataAccess.Models;

namespace UtilidadesAPI.Controllers
{
    [Route("UtilidadesAPI/[controller]")]
    [ApiController]
    public class DataElementsController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public DataElementsController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/DataElements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DataElement>>> GetDataElements()
        {
            return await _context.DataElements.ToListAsync();
        }

        // GET: api/DataElements/5
        [HttpGet("{module}")]
        public async Task<ActionResult<DataElement>> GetDataElement(string module)
        {
            var dataElement = await _context.DataElements.Where(x => x.Module == module).FirstOrDefaultAsync();

            if (dataElement == null)
            {
                return NotFound();
            }

            return dataElement;
        }

        // PUT: api/DataElements/5
        [HttpPut("{module}")]
        public async Task<IActionResult> PutDataElement(string module, DataElement dataElement)
        {
            var result = await _context.DataElements.Where(x => x.Module == module).FirstOrDefaultAsync();
            if(result == null)
            {
                return BadRequest();
            }

            result.Module = dataElement.Module;
            result.Json = dataElement.Json;
            _context.Entry(result).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return Ok(CreatedAtAction("Update", new { id = result.Id }, result.Id));
        }

        // POST: api/DataElements
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DataElement>> PostDataElement(DataElement dataElement)
        {
            _context.DataElements.Add(dataElement);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDataElement", new { id = dataElement.Id }, dataElement);
        }

        // DELETE: api/DataElements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDataElement(int id)
        {
            var dataElement = await _context.DataElements.FindAsync(id);
            if (dataElement == null)
            {
                return NotFound();
            }

            _context.DataElements.Remove(dataElement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DataElementExists(int id)
        {
            return _context.DataElements.Any(e => e.Id == id);
        }
    }
}
