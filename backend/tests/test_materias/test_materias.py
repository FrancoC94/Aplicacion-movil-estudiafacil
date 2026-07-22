def test_create_materia(client, auth_headers):
    response = client.post(
        "/materias",
        json={"nombre": "Matemáticas", "profesor": "Prof. Gómez", "color": "#FF5733", "creditos": 4},
        headers=auth_headers,
    )
    assert response.status_code == 201
    assert response.json()["nombre"] == "Matemáticas"


def test_list_materias(client, auth_headers):
    client.post("/materias", json={"nombre": "Física"}, headers=auth_headers)
    response = client.get("/materias", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_materia_requires_auth(client):
    response = client.get("/materias")
    assert response.status_code == 401
