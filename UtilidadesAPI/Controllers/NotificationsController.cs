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
    public class NotificationsController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public NotificationsController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {
            return await _context.Notifications.OrderByDescending(x => x.Id).ToListAsync();
        }

        // GET: api/Notifications/ByProfile
        [HttpGet]
        [Route("ByProfile/{profile}")]
        public async Task<ActionResult<List<Notification>>> GetNotificationByProfile(string profile)
        {
            var notification = await _context.Notifications.Where(x => x.Profile.Equals(profile)).OrderByDescending(x=> x.Id).ToListAsync();
            if (notification == null)
            { 
                return new List<Notification>();
            }
            return notification;
        }

        // GET: api/Notifications/ByCompany
        [HttpGet("{companyDocument}")]
        public async Task<ActionResult<List<Notification>>> GetNotificationByCompany(string companyDocument)
        {
            var notification = await _context.Notifications.Where(x=> x.Text2.Contains(companyDocument)).OrderByDescending(x => x.Id).ToListAsync();
            if (notification == null)
            {                
                return new List<Notification>();
            }
            return notification;
        }

        // PUT: api/Notifications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotification(int id, Notification notification)
        {
            if (id != notification.Id)
            {
                return BadRequest();
            }

            _context.Entry(notification).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationExists(id))
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

        // POST: api/Notifications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Notification>> PostNotification(Notification[] notification)
        {
            for (int i = 0; i < notification.Length; i++)
            {
                _context.Notifications.Add(notification[i]);
            }               
            await _context.SaveChangesAsync();

            return Ok(CreatedAtAction("PostNotification", new { count = notification.Length }));
        }
         
        // DELETE: api/Notifications/5
        [HttpDelete]
        public async Task<IActionResult> DeleteNotification(int[] ids)
        {
            for (int i = 0; i < ids.Length; i++)
            {
                var notification = await _context.Notifications.Where(x=> x.Id == ids[i]).FirstOrDefaultAsync();
                if (notification != default)
                {
                   _context.Notifications.Remove(notification);
                }
            }
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Notifications/5
        [HttpDelete("{companyDocument}")]
        public async Task<IActionResult> DeleteNotificationByCompany(string companyDocument)
        {
            var notification = await _context.Notifications.Where(x => x.Text2.Contains(companyDocument)).ToListAsync();
            for (int i = 0; i < notification.Count; i++)
            {
                _context.Notifications.Remove(notification[i]);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool NotificationExists(int id)
        {
            return _context.Notifications.Any(e => e.Id == id);
        }
    }
}
