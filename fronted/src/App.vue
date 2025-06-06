<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">Facturation</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/factures" class="nav-link">Factures</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/clients" class="nav-link">Clients</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <router-view />
</template>

<script setup>
</script>

<style>
.btn {
  opacity: 1;
  transition: background-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.add-btn {
  display: inline-block;
  font-weight: 500;
  color: #ffffff !important;
  background-color: #28a745 !important;
  border: 1px solid #28a745 !important;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
}

.add-btn:hover:not(:disabled),
.add-btn:focus:not(:disabled) {
  background-color: #218838 !important;
  border-color: #1e7e34 !important;
}

.action-btn {
  display: inline-block;
  font-weight: 500;
  color: #ffffff !important;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
}

.btn-primary.action-btn {
  background-color: #007bff !important;
  border: 1px solid #007bff !important;
}

.btn-primary.action-btn:hover:not(:disabled),
.btn-primary.action-btn:focus:not(:disabled) {
  background-color: #0056b3 !important;
  border-color: #0056b3 !important;
}

.btn-danger.action-btn {
  background-color: #dc3545 !important;
  border: 1px solid #dc3545 !important;
}

.btn-danger.action-btn:hover:not(:disabled),
.btn-danger.action-btn:focus:not(:disabled) {
  background-color: #c82333 !important;
  border-color: #bd2130 !important;
}

.table {
  width: 100%;
  margin-top: 1.5rem;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table thead th {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #dee2e6;
}

.table tbody tr:nth-of-type(odd) {
  background-color: #f8f9fa;
}

.table tbody tr:hover {
  background-color: #f1f3f5;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
}

.table td:last-child,
.table th:last-child {
  text-align: center;
}

.text-center {
  padding: 1rem 0;
  color: #6c757d;
  font-style: italic;
}

.list-container {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.header-row h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    align-items: stretch;
  }
  .header-row .col-md-4 {
    margin-top: 1rem;
    text-align: center;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #343a40;
  color: #ffffff;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.875rem;
  z-index: 100; /* pour qu’il reste au-dessus du contenu */
}

.footer a {
  color: #ffffff;
  text-decoration: underline;
  transition: color 0.15s ease-in-out;
}

.footer a:hover,
.footer a:focus {
  color: #dddddd;
}

.navbar {
  background-color: #ffffff !important;
  border-bottom: 1px solid #ced4da;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 600;
  color: #007bff !important;
}

.navbar-brand:hover,
.navbar-brand:focus {
  color: #0056b3 !important;
}

.navbar-toggler {
  border-color: #007bff;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%280,123,255,1%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.navbar-nav .nav-item + .nav-item {
  margin-left: 1rem;
}

.nav-link {
  color: #6c757d !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: color 0.15s ease-in-out;
}

.nav-link:hover,
.nav-link:focus {
  color: #007bff !important;
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.25rem;
  }
}

</style>
