import Foundation

enum NetworkError: Error {
    case invalidURL
    case noData
    case decodingError
    case serverError(String)
}

class APIService {
    static let shared = APIService()
    
    // Cambia esto a la IP de tu servidor (ej. http://localhost:3000 o tu URL de desplegue)
    private let baseURL = "https://r8f86v0l-3000.usw3.devtunnels.ms" 
    
    private init() {}
    
    /// Método genérico para realizar peticiones GET reales
    func fetch<T: Decodable>(endpoint: String) async throws -> T {
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            throw NetworkError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.serverError("Respuesta de servidor inválida")
        }
        
        let decoder = JSONDecoder()
        // Eliminamos convertFromSnakeCase porque ya usamos CodingKeys manuales en los modelos
        // decoder.keyDecodingStrategy = .convertFromSnakeCase 
        
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            print("❌ Error de decodificación: \(error)")
            throw NetworkError.decodingError
        }
    }
    
    /// Método genérico para realizar peticiones POST/PATCH reales
    func send<T: Encodable>(endpoint: String, body: T) async throws {
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            throw NetworkError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        let bodyData = try encoder.encode(body)
        
        // Asignamos el cuerpo a la petición
        request.httpBody = bodyData
        
        // Usamos data(for:) que es el estándar para peticiones con body JSON
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.serverError("Error al enviar datos")
        }
    }
}
