using Microsoft.AspNetCore.Mvc;
using net.Repositories;

namespace net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IStatusRepository _statusRepository;
        public StatusController(IStatusRepository statusRepository)
        {
            // Constructor logic here
            _statusRepository = statusRepository;
        }

        [HttpGet]
        public ActionResult<string> Get()
        {
            return _statusRepository.getStatus();
        }
    }
}
