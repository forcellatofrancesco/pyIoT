import asyncio
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import random
import time
import requests


class Lightbulb(BaseModel):
    status: bool = False


lights: dict[Lightbulb] = {
    "living": Lightbulb(status=True), "kitchen": Lightbulb(), "bathroom": Lightbulb()
}

# Define the dimensions of the matrix
rows = 8
cols = 12

# Create the matrix filled with zeros
matrix = [[0 for _ in range(rows)] for _ in range(cols)]


app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def get_index(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            'temperature': (await read_temp())['data'],
            'day': (await read_day())['data'],
            'time': (await read_time())['data'],
            'lights': (await read_lights()),
            'matrix': matrix,
            'rows': rows,
            'cols': cols,
        }
    )


@app.get("/temperature")
async def read_temp():
    return {"data": random.randint(2000, 9000)/100.}


@app.get("/day")
async def read_day():
    res: str = time.strftime("%d/%m/%Y")
    return {"data": res}


@app.get("/time")
async def read_time():
    res: str = time.strftime("%H:%M:%S", time.localtime())
    return {"data": res}


@app.put("/lightbulb/{name}", response_model=Lightbulb)
async def update_lightbulb(name: str):
    global lights
    light: Lightbulb = lights[name]
    light.status = not light.status
    lights[name] = light
    # Simulate the delay for physically switching the light on or off
    await asyncio.sleep(random.randint(300, 2000)/1000.)
    return lights[name]


@app.get("/lightbulb/{name}", response_model=Lightbulb)
async def get_lightbulb(name: str):
    return lights[name]


@app.get("/lightbulb")
async def read_lights():
    return list(map(lambda kv: {"name": kv[0], "status": kv[1].status}, lights.items()))


@app.get("/led/{x}/{y}")
async def updateLed(x, y):
    x = int(x)
    y = int(y)
    action = ""
    if matrix[x][y] == 0:
        matrix[x][y] = 1
        action = "on"
    else:
        matrix[x][y] = 0
        action = "off"
    requests.get(f"http://192.168.135.119/led/{action}?x={x}&y={y}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
