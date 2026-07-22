def test_create_tarea(client, auth_headers):
    materia = client.post("/materias", json={"nombre": "Historia"}, headers=auth_headers).json()
    response = client.post(
        "/tareas",
        json={
            "titulo": "Ensayo sobre la Revolución",
            "fecha_entrega": "2026-08-01T00:00:00",
            "materia_id": materia["id"],
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    assert response.json()["titulo"] == "Ensayo sobre la Revolución"


def test_create_tarea_materia_ajena(client, auth_headers):
    response = client.post(
        "/tareas",
        json={
            "titulo": "Tarea inválida",
            "fecha_entrega": "2026-08-01T00:00:00",
            "materia_id": 9999,
        },
        headers=auth_headers,
    )
    assert response.status_code in (403, 404)
