from fastapi import FastAPI
from controller.project_controller import router as project_router
from controller.task_controller import router as task_router
from controller.foreman_controller import router as foreman_router
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.head("/")
def head():
    return

@app.get("/")
def home():
    return {"message": "Bienvenido al módulo de proyectos de PSA"}

app.include_router(project_router)
app.include_router(task_router)
app.include_router(foreman_router)

app.title = "Módulo proyectos de PSA"
app.version = "1.0"
