def test_user_can_save_optional_study_location(client, auth_headers):
    location = '{"latitude":-2.17,"longitude":-79.92,"precision":"aproximada"}'
    response = client.put("/users/me", json={"ubicacion_estudio": location}, headers=auth_headers)

    assert response.status_code == 200
    assert response.json()["ubicacion_estudio"] == location

    me = client.get("/users/me", headers=auth_headers)
    assert me.json()["ubicacion_estudio"] == location
