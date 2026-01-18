export const translations = {
  tr: {
    // Common
    appName: 'Vegan Rehber',
    loading: 'Yükleniyor...',
    error: 'Hata',
    retry: 'Tekrar Dene',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
    back: 'Geri',
    next: 'İleri',
    submit: 'Gönder',
    search: 'Ara',
    all: 'Tümü',

    // Navigation
    nav: {
      home: 'Ana Sayfa',
      search: 'Ara',
      scanner: 'Tarayıcı',
      report: 'Bildir',
    },

    // Home
    home: {
      title: 'Vegan Rehber',
      categories: 'Kategoriler',
    },

    // Search
    searchPage: {
      title: 'Ürün Ara',
      placeholder: 'Ürün veya marka ara...',
      noResults: 'Sonuç bulunamadı',
      noResultsDescription: 'Arama kriterlerinize uygun ürün bulunamadı.',
      noFavorites: 'Favori ürününüz yok',
      noFavoritesDescription: 'Beğendiğiniz ürünleri favorilere ekleyin.',
      showFavorites: 'Favorileri Göster',
      sortBy: 'Sırala',
      sortOptions: {
        nameAsc: 'İsim (A-Z)',
        nameDesc: 'İsim (Z-A)',
        brandAsc: 'Marka (A-Z)',
        brandDesc: 'Marka (Z-A)',
      },
    },

    // Product
    product: {
      notFound: 'Ürün bulunamadı',
      ingredients: 'İçindekiler',
      barcode: 'Barkod',
      category: 'Kategori',
      brand: 'Marka',
      share: 'Paylaş',
      addToFavorites: 'Favorilere Ekle',
      removeFromFavorites: 'Favorilerden Çıkar',
      recentlyViewed: 'Son Görüntülenenler',
    },

    // Scanner
    scanner: {
      title: 'Barkod Tara',
      notFound: 'Ürün veritabanımızda bulunamadı',
      scanning: 'Taranıyor...',
      permissionDenied: 'Kamera izni reddedildi',
    },

    // Report
    report: {
      title: 'Ürün Bildir',
      suggestNew: 'Yeni Ürün Öner',
      reportIssue: 'Sorun Bildir',
      name: 'İsim',
      email: 'E-posta',
      description: 'Açıklama',
      descriptionPlaceholder: {
        new: 'Lütfen ürün detaylarını yazın (isim, marka, içindekiler)...',
        report: 'Lütfen ürünle ilgili sorunu açıklayın...',
      },
      submitting: 'Gönderiliyor...',
      success: 'Teşekkürler! Gönderiminiz alındı.',
      error: 'Gönderim başarısız. Lütfen tekrar deneyin.',
      queued: 'Çevrimdışısınız. Gönderiminiz internete bağlandığınızda gönderilecek.',
    },

    // Categories
    categories: {
      'Atıştırmalık': 'Atıştırmalık',
      'Çikolata': 'Çikolata',
      'Temizlik': 'Temizlik',
      'Kahvaltılık': 'Kahvaltılık',
      'Konserve': 'Konserve',
      'Sos': 'Sos',
      'Dondurulmuş Gıda': 'Dondurulmuş Gıda',
      'Şarküteri': 'Şarküteri',
    },

    // Offline
    offline: {
      indicator: 'Çevrimdışısınız - Bazı özellikler kısıtlı olabilir',
      reconnected: 'Tekrar bağlandınız',
    },

    // Errors
    errors: {
      generic: 'Bir şeyler yanlış gitti',
      networkError: 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
      loadFailed: 'Veriler yüklenemedi',
    },

    // Dark mode
    darkMode: {
      toggle: 'Tema Değiştir',
      light: 'Açık Tema',
      dark: 'Koyu Tema',
    },

    // Admin
    admin: {
      title: 'Yönetim Paneli',
      login: 'Giriş',
      logout: 'Çıkış',
      enterPin: 'Devam etmek için PIN girin',
      wrongPin: 'Yanlış PIN',
      pinTooShort: 'PIN en az 4 karakter olmalı',
      accountLocked: 'Hesap Kilitlendi',
      tryAgainIn: 'Tekrar deneyin',
      attemptsRemaining: 'Kalan deneme',
      loginSuccess: 'Giriş başarılı',
      logoutSuccess: 'Çıkış yapıldı',
      products: 'Ürünler',
      addProduct: 'Ürün Ekle',
      editProduct: 'Ürün Düzenle',
      productName: 'Ürün Adı',
      brand: 'Marka',
      category: 'Kategori',
      selectCategory: 'Kategori seçin',
      ingredients: 'İçindekiler',
      ingredientsPlaceholder: 'İçindekiler listesini girin...',
      imageUrl: 'Resim URL',
      barcode: 'Barkod',
      barcodeHelp: 'EAN-8 veya EAN-13 barkod (8-13 rakam)',
      nameRequired: 'Ürün adı gerekli',
      brandRequired: 'Marka gerekli',
      categoryRequired: 'Kategori gerekli',
      invalidUrl: 'Geçersiz URL',
      invalidBarcode: 'Barkod 8-13 rakam olmalı',
      save: 'Kaydet',
      saving: 'Kaydediliyor...',
      addSuccess: 'Ürün eklendi',
      updateSuccess: 'Ürün güncellendi',
      saveError: 'Kaydetme başarısız',
      delete: 'Sil',
      deleting: 'Siliniyor...',
      deleteSuccess: 'Ürün silindi',
      deleteError: 'Silme başarısız',
      confirmDelete: 'Ürünü Sil?',
      deleteWarning: 'Bu ürünü silmek istediğinizden emin misiniz:',
      cannotUndo: 'Bu işlem geri alınamaz.',
      searchProducts: 'Ürün ara...',
      noProducts: 'Ürün bulunamadı',
      of: '/',
      productsShown: 'ürün',
      image: 'Resim',
      name: 'Ad',
      actions: 'İşlemler',
      edit: 'Düzenle',
      refreshData: 'Verileri Yenile',
      refreshSuccess: 'Veriler yenilendi',
      refreshError: 'Yenileme başarısız',
      backToApp: 'Uygulamaya Dön',
      writeNotEnabled: 'Yazma işlemleri etkin değil',
      productNotFound: 'Ürün bulunamadı',
    },
  },

  en: {
    // Common
    appName: 'Vegan Guide',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    all: 'All',

    // Navigation
    nav: {
      home: 'Home',
      search: 'Search',
      scanner: 'Scanner',
      report: 'Report',
    },

    // Home
    home: {
      title: 'Vegan Guide',
      categories: 'Categories',
    },

    // Search
    searchPage: {
      title: 'Search Products',
      placeholder: 'Search products or brands...',
      noResults: 'No results found',
      noResultsDescription: 'No products match your search criteria.',
      noFavorites: 'No favorite products yet',
      noFavoritesDescription: 'Add products you like to your favorites.',
      showFavorites: 'Show Favorites',
      sortBy: 'Sort by',
      sortOptions: {
        nameAsc: 'Name (A-Z)',
        nameDesc: 'Name (Z-A)',
        brandAsc: 'Brand (A-Z)',
        brandDesc: 'Brand (Z-A)',
      },
    },

    // Product
    product: {
      notFound: 'Product not found',
      ingredients: 'Ingredients',
      barcode: 'Barcode',
      category: 'Category',
      brand: 'Brand',
      share: 'Share',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      recentlyViewed: 'Recently Viewed',
    },

    // Scanner
    scanner: {
      title: 'Scan Barcode',
      notFound: 'Product not found in our database',
      scanning: 'Scanning...',
      permissionDenied: 'Camera permission denied',
    },

    // Report
    report: {
      title: 'Report Product',
      suggestNew: 'Suggest New',
      reportIssue: 'Report Issue',
      name: 'Name',
      email: 'Email',
      description: 'Description',
      descriptionPlaceholder: {
        new: 'Please provide product details (name, brand, ingredients)...',
        report: 'Please describe the issue with this product...',
      },
      submitting: 'Submitting...',
      success: 'Thank you! Your submission has been received.',
      error: 'Submission failed. Please try again.',
      queued: 'You are offline. Your submission will be sent when you reconnect.',
    },

    // Categories
    categories: {
      'Atıştırmalık': 'Snacks',
      'Çikolata': 'Chocolate',
      'Temizlik': 'Cleaning',
      'Kahvaltılık': 'Breakfast',
      'Konserve': 'Canned',
      'Sos': 'Sauce',
      'Dondurulmuş Gıda': 'Frozen Food',
      'Şarküteri': 'Deli',
    },

    // Offline
    offline: {
      indicator: 'You are offline - Some features may be limited',
      reconnected: 'You are back online',
    },

    // Errors
    errors: {
      generic: 'Something went wrong',
      networkError: 'Network error. Please check your connection.',
      loadFailed: 'Failed to load data',
    },

    // Dark mode
    darkMode: {
      toggle: 'Toggle Theme',
      light: 'Light Mode',
      dark: 'Dark Mode',
    },

    // Admin
    admin: {
      title: 'Admin Panel',
      login: 'Login',
      logout: 'Logout',
      enterPin: 'Enter your PIN to continue',
      wrongPin: 'Wrong PIN',
      pinTooShort: 'PIN must be at least 4 characters',
      accountLocked: 'Account Locked',
      tryAgainIn: 'Try again in',
      attemptsRemaining: 'Attempts remaining',
      loginSuccess: 'Successfully logged in',
      logoutSuccess: 'Logged out',
      products: 'Products',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      productName: 'Product Name',
      brand: 'Brand',
      category: 'Category',
      selectCategory: 'Select category',
      ingredients: 'Ingredients',
      ingredientsPlaceholder: 'Enter ingredients list...',
      imageUrl: 'Image URL',
      barcode: 'Barcode',
      barcodeHelp: 'EAN-8 or EAN-13 barcode (8-13 digits)',
      nameRequired: 'Product name is required',
      brandRequired: 'Brand is required',
      categoryRequired: 'Category is required',
      invalidUrl: 'Invalid URL',
      invalidBarcode: 'Barcode must be 8-13 digits',
      save: 'Save',
      saving: 'Saving...',
      addSuccess: 'Product added',
      updateSuccess: 'Product updated',
      saveError: 'Failed to save',
      delete: 'Delete',
      deleting: 'Deleting...',
      deleteSuccess: 'Product deleted',
      deleteError: 'Failed to delete',
      confirmDelete: 'Delete Product?',
      deleteWarning: 'Are you sure you want to delete',
      cannotUndo: 'This action cannot be undone.',
      searchProducts: 'Search products...',
      noProducts: 'No products found',
      of: 'of',
      productsShown: 'products',
      image: 'Image',
      name: 'Name',
      actions: 'Actions',
      edit: 'Edit',
      refreshData: 'Refresh Data',
      refreshSuccess: 'Data refreshed',
      refreshError: 'Failed to refresh',
      backToApp: 'Back to App',
      writeNotEnabled: 'Write operations not enabled',
      productNotFound: 'Product not found',
    },
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.tr;
