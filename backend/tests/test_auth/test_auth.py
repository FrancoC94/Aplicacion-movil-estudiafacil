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
