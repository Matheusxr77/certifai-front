import { 
    FiEdit3, 
    FiTrash2, 
    FiUser, 
    FiSearch, 
    FiFilter 
} from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { useManagementController } from './indexController';
import { ROLE_OPTIONS } from './indexModel';
import EditUserModal from './components/EditUserModal/index';
import DeleteUserModal from './components/DeleteUserModal/index';
import Sidebar from '../../components/sidebar';
import './styles.css';

const Management: React.FC = () => {
    const {
        isLoading,
        error,
        selectedUser,
        showEditModal,
        showDeleteModal,
        handleEditUser,
        handleDeleteUser,
        closeModals,
        handleUserUpdate,
        handleUserDeletion,
        toggleSidebar,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        filteredUsers,
        getRoleLabel,
        getRoleClass,
        isSidebarExpanded
    } = useManagementController();

    if (isLoading) {
        return (
            <div className={`management-page ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                <Sidebar 
                    isExpanded={isSidebarExpanded} 
                    toggleSidebar={toggleSidebar} 
                />
                <main className="main-content">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>Carregando usuários...</span>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`management-page ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
            <Sidebar 
                isExpanded={isSidebarExpanded} 
                toggleSidebar={toggleSidebar} 
            />
            <main className="main-content">
                <div className="management-container">
                    <div className="title-section">
                        <FaUsers className="page-icon" />
                        <h1 className="page-title">Gerenciamento de Usuários</h1>
                    </div>

                    <div className="content-section">
                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="filters-section">
                            <div className="search-container">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nome ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            
                            <div className="filter-container">
                                <FiFilter className="filter-icon" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Todos os perfis</option>
                                    {ROLE_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="table-section">
                            <div className="table-header">
                                <h3>Lista de Usuários</h3>
                                <span className="results-count">
                                    {filteredUsers.length === 0 ? (
                                        <span>Nenhum usuário encontrado</span>
                                    ) : filteredUsers.length === 1 ? (
                                        <span>1 usuário encontrado</span>
                                    ) : (
                                        <span>{filteredUsers.length} usuários encontrados</span>
                                    )}
                                </span>
                            </div>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Usuário</th>
                                            <th>Perfil</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="table-row">
                                                <td className="user-info">
                                                    <div className="user-avatar">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="user-details">
                                                        <span className="user-name">{user.name}</span>
                                                        <span className="user-email">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge role-badge ${getRoleClass(user.role)}`}>
                                                        {getRoleLabel(user.role)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                        {user.isActive ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="action-btn edit-btn"
                                                            title="Editar usuário"
                                                        >
                                                            <FiEdit3 />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="action-btn delete-btn"
                                                            title="Excluir usuário"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredUsers.length === 0 && !isLoading && (
                                    <div className="empty-state">
                                        <FiUser className="empty-icon" />
                                        <h3>Nenhum usuário encontrado</h3>
                                        <p>Tente ajustar os filtros ou adicionar novos usuários</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {showEditModal && selectedUser && (
                        <EditUserModal
                            user={selectedUser}
                            onClose={closeModals}
                            onUpdate={handleUserUpdate}
                        />
                    )}

                    {showDeleteModal && selectedUser && (
                        <DeleteUserModal
                            user={selectedUser}
                            onClose={closeModals}
                            onDelete={handleUserDeletion}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Management;