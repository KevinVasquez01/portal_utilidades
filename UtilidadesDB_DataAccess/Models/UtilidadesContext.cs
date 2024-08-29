using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class UtilidadesContext : DbContext
    {
        public UtilidadesContext()
        {
        }

        public UtilidadesContext(DbContextOptions<UtilidadesContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CompaniesReportedSalesforce> CompaniesReportedSalesforces { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<CompanyContact> CompanyContacts { get; set; }
        public virtual DbSet<CompanyDataCreation> CompanyDataCreations { get; set; }
        public virtual DbSet<CompanyResponsibility> CompanyResponsibilities { get; set; }
        public virtual DbSet<CompanySeries> CompanySeries { get; set; }
        public virtual DbSet<CompanyUser> CompanyUsers { get; set; }
        public virtual DbSet<DataElement> DataElements { get; set; }
        public virtual DbSet<DefaultTemplate> DefaultTemplates { get; set; }
        public virtual DbSet<HistoryChangesSinco> HistoryChangesSincos { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<ReportsHistory> ReportsHistories { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<UsersMovement> UsersMovements { get; set; }
        public virtual DbSet<UsersProfile> UsersProfiles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                //optionsBuilder.UseSqlServer("Data Source=COLWINLENWTQB;Initial Catalog=Utilidades;Integrated Security=True;");
                optionsBuilder.UseSqlServer("Data Source=DESKTOP-H91POP2;Initial Catalog=Utilidades;User ID=sa;Password=root");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<CompaniesReportedSalesforce>(entity =>
            {
                entity.ToTable("CompaniesReportedSalesforce");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DateActivation)
                    .HasColumnType("datetime")
                    .HasColumnName("date_activation");

                entity.Property(e => e.DocumentNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("document_number")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.ReportType)
                    .IsRequired()
                    .HasMaxLength(120)
                    .IsUnicode(false)
                    .HasColumnName("report_type")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.User)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("user");
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("Company");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CheckDigit)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("checkDigit")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.CountryCode)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("countryCode")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.DistributorId)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("distributorId")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.DocumentNumber)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("documentNumber")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.DocumentType)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("documentType")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.FamilyName)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("familyName")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("firstName")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.LanguageCode)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("languageCode")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.LegalType)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("legalType")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.MiddleName)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("middleName")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("name")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.NamePackageOrplan)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("namePackageORPlan")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.PackDefault).HasColumnName("packDefault");

                entity.Property(e => e.TaxScheme)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("taxScheme")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.TimezoneCode)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("timezoneCode")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.VirtualOperator)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("virtualOperator")
                    .HasDefaultValueSql("('')");
            });

            modelBuilder.Entity<CompanyContact>(entity =>
            {
                entity.ToTable("Company_Contact");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AddressLine)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("addressLine")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.CityCode)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("cityCode")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("country")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.DepartmentCode)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("departmentCode")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("email")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.FinancialSupportEmail)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("financialSupportEmail")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.IdCompany).HasColumnName("id_company");

                entity.Property(e => e.PostalCode)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("postalCode")
                    .HasDefaultValueSql("('')");

                entity.HasOne(d => d.IdCompanyNavigation)
                    .WithMany(p => p.CompanyContacts)
                    .HasForeignKey(d => d.IdCompany)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Company_Contact");
            });

            modelBuilder.Entity<CompanyDataCreation>(entity =>
            {
                entity.ToTable("Company_DataCreation");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DateCreation)
                    .HasColumnType("datetime")
                    .HasColumnName("date_creation");

                entity.Property(e => e.DocumentsuportIncluded).HasColumnName("documentsuport_included");

                entity.Property(e => e.IdCompany).HasColumnName("id_company");

                entity.Property(e => e.PayrrollIncluded).HasColumnName("payrroll_included");

                entity.Property(e => e.ReceptionSalesinvoiceIncluded).HasColumnName("reception_salesinvoice_included");

                entity.Property(e => e.SalesinvoiceIncluded).HasColumnName("salesinvoice_included");

                entity.HasOne(d => d.IdCompanyNavigation)
                    .WithMany(p => p.CompanyDataCreations)
                    .HasForeignKey(d => d.IdCompany)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Company_DataCreation_Company");
            });

            modelBuilder.Entity<CompanyResponsibility>(entity =>
            {
                entity.ToTable("Company_Responsibilities");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.IdCompany).HasColumnName("id_company");

                entity.Property(e => e.ResponsabilityTypes)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("responsabilityTypes")
                    .HasDefaultValueSql("('')");

                entity.HasOne(d => d.IdCompanyNavigation)
                    .WithMany(p => p.CompanyResponsibilities)
                    .HasForeignKey(d => d.IdCompany)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Company_Responsibilities");
            });

            modelBuilder.Entity<CompanySeries>(entity =>
            {
                entity.ToTable("Company_Series");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AuthorizationNumber)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("authorizationNumber")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.EfectiveValue)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("efectiveValue")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.EndValue).HasColumnName("endValue");

                entity.Property(e => e.IdCompany).HasColumnName("id_company");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("name")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Prefix)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("prefix")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.StartValue).HasColumnName("startValue");

                entity.Property(e => e.TechnicalKey)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("technicalKey")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.TestSetId)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("testSetId")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.ValidFrom)
                    .HasColumnType("datetime")
                    .HasColumnName("validFrom");

                entity.Property(e => e.ValidTo)
                    .HasColumnType("datetime")
                    .HasColumnName("validTo");

                entity.HasOne(d => d.IdCompanyNavigation)
                    .WithMany(p => p.CompanySeries)
                    .HasForeignKey(d => d.IdCompany)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Company_Series_Company");
            });

            modelBuilder.Entity<CompanyUser>(entity =>
            {
                entity.ToTable("Company_Users");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CompanyMemberships)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("companyMemberships");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.IdCompany).HasColumnName("id_company");

                entity.Property(e => e.IsBlocked).HasColumnName("isBlocked");

                entity.Property(e => e.LanguageCode)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("languageCode");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("name");

                entity.Property(e => e.SystemMemberships)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("systemMemberships");

                entity.Property(e => e.Telephone)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("telephone");

                entity.Property(e => e.Timezone)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("timezone");

                entity.Property(e => e.VirtualOperatorMemberships)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("virtualOperatorMemberships");

                entity.HasOne(d => d.IdCompanyNavigation)
                    .WithMany(p => p.CompanyUsers)
                    .HasForeignKey(d => d.IdCompany)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Company_Users_Company");
            });

            modelBuilder.Entity<DataElement>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Json)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("json");

                entity.Property(e => e.Module)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false)
                    .HasColumnName("module");
            });

            modelBuilder.Entity<DefaultTemplate>(entity =>
            {
                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasColumnType("ntext")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.DocumentType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValueSql("('')");
            });

            modelBuilder.Entity<HistoryChangesSinco>(entity =>
            {
                entity.ToTable("HistoryChangesSinco");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("company_name")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.CustomField1)
                    .HasColumnName("custom_field1")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.CustomField2)
                    .HasColumnName("custom_field2")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.CustomField3)
                    .HasColumnName("custom_field3")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.DateChange)
                    .HasColumnType("datetime")
                    .HasColumnName("date_change");

                entity.Property(e => e.DocumentNumber)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("document_number")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Dv)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("dv")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.IsHtml).HasColumnName("is_html");

                entity.Property(e => e.IsMacroplantilla).HasColumnName("is_macroplantilla");

                entity.Property(e => e.OtherChanges)
                    .HasColumnName("other_changes")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.UserCreator)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("user_creator")
                    .HasDefaultValueSql("('')");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Date)
                    .HasColumnType("datetime")
                    .HasColumnName("date");

                entity.Property(e => e.Icon)
                    .IsRequired()
                    .HasMaxLength(256)
                    .HasColumnName("icon");

                entity.Property(e => e.Notification1)
                    .IsRequired()
                    .HasMaxLength(256)
                    .HasColumnName("notification");

                entity.Property(e => e.Profile)
                    .IsRequired()
                    .HasMaxLength(256)
                    .HasColumnName("profile");

                entity.Property(e => e.Round)
                    .IsRequired()
                    .HasMaxLength(256)
                    .HasColumnName("round");

                entity.Property(e => e.Show).HasColumnName("show");

                entity.Property(e => e.Text1)
                    .IsRequired()
                    .HasMaxLength(256)
                    .HasColumnName("text1");

                entity.Property(e => e.Text2)
                    .IsRequired()
                    .HasMaxLength(256)
                    .HasColumnName("text2");

                entity.Property(e => e.Url)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("url");
            });

            modelBuilder.Entity<ReportsHistory>(entity =>
            {
                entity.ToTable("Reports_History");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Date)
                    .HasColumnType("datetime")
                    .HasColumnName("date");

                entity.Property(e => e.Json)
                    .IsRequired()
                    .HasColumnType("ntext")
                    .HasColumnName("json");

                entity.Property(e => e.NewCompanies)
                    .HasColumnType("numeric(18, 0)")
                    .HasColumnName("new_companies")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.NewMoney)
                    .HasColumnType("decimal(18, 0)")
                    .HasColumnName("new_money")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.ReportType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("report_type");

                entity.Property(e => e.User)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("user");
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CompanyDocument)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("company_document")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Date)
                    .HasColumnType("datetime")
                    .HasColumnName("date");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("description")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.TransactionType).HasColumnName("Transaction_type");

                entity.Property(e => e.User)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("user")
                    .HasDefaultValueSql("('')");
            });

            modelBuilder.Entity<UsersMovement>(entity =>
            {
                entity.ToTable("Users_Movements");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Ambient)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("ambient")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Component)
                    .IsRequired()
                    .HasMaxLength(512)
                    .HasColumnName("component")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Date)
                    .HasColumnType("datetime")
                    .HasColumnName("date");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("description")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.User)
                    .IsRequired()
                    .HasMaxLength(512)
                    .HasColumnName("user")
                    .HasDefaultValueSql("('')");
            });

            modelBuilder.Entity<UsersProfile>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Profile)
                    .IsRequired()
                    .HasMaxLength(256)
                    .HasColumnName("profile");

                entity.Property(e => e.User)
                    .IsRequired()
                    .HasMaxLength(512)
                    .HasColumnName("user");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
