def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={"nombre": "Ana Pérez", "email": "ana@example.com", "password": "password123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "ana@example.com"
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {"nombre": "Ana Pérez", "email": "ana@example.com", "password": "password123"}
    client.post("/auth/register", json=payload)
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 409


def test_login_success(client):
    client.post(
        "/auth/register",
        json={"nombre": "Ana Pérez", "email": "ana@example.com", "password": "password123"},
    )
    response = client.post(
        "/auth/login",
        data={"username": "ana@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post(
        "/auth/register",
        json={"nombre": "Ana Pérez", "email": "ana@example.com", "password": "password123"},
    )
    response = client.post(
        "/auth/login",
        data={"username": "ana@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401


def test_refresh_token_success(client):
    client.post(
        "/auth/register",
        json={"nombre": "Carlos Gómez", "email": "carlos@example.com", "password": "password123"},
    )
    login_res = client.post(
        "/auth/login",
        data={"username": "carlos@example.com", "password": "password123"},
    )
    assert login_res.status_code == 200
    refresh_token = login_res.json()["refresh_token"]

    refresh_res = client.post(
        "/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refresh_res.status_code == 200
    data = refresh_res.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_refresh_token_invalid(client):
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "token_invalido_123"},
    )
    assert response.status_code == 401

