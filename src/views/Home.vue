<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Kalkulator RAB Konstruksi
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Hitung estimasi biaya proyek konstruksi Anda dengan mudah dan akurat
      </p>
      <router-link
        to="/calculator"
        class="btn-primary text-lg"
      >
        Mulai Menghitung
      </router-link>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900">Dimensi Bangunan</h3>
        <p class="mt-2 text-gray-600">
          Masukkan ukuran dan spesifikasi dasar bangunan Anda
        </p>
      </div>

      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900">Kuesioner Kebutuhan</h3>
        <p class="mt-2 text-gray-600">
          Jawab pertanyaan tentang kebutuhan spesifik proyek Anda
        </p>
      </div>

      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900">Formula Fleksibel</h3>
        <p class="mt-2 text-gray-600">
          Sesuaikan perhitungan dengan kebutuhan proyek Anda
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home component logic will go here
</script> 