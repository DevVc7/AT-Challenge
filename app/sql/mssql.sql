IF DB_ID('AgentReferral') IS NULL
BEGIN
    CREATE DATABASE AgentReferral;
END
GO

USE AgentReferral;
GO

IF OBJECT_ID('dbo.Agents', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Agents
    (
        Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        FirstName NVARCHAR(100) NOT NULL,
        LastName NVARCHAR(100) NOT NULL,
        Phone NVARCHAR(32) NULL,
        Username NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(128) NOT NULL,
        Status NVARCHAR(32) NOT NULL DEFAULT 'inactive',
        ReferralParentId UNIQUEIDENTIFIER NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    ALTER TABLE dbo.Agents
        ADD CONSTRAINT FK_Agents_Referral
            FOREIGN KEY (ReferralParentId) REFERENCES dbo.Agents(Id);

    CREATE INDEX IX_Agents_ReferralParentId ON dbo.Agents(ReferralParentId);
END
GO

MERGE dbo.Agents AS target
USING (VALUES
    ('System','Admin','555-0101','admin', LOWER(CONVERT(VARCHAR(64), HASHBYTES('SHA2_256','admin123!'), 2)), 'inactive', NULL),
    ('Alice','Broker','555-0110','alice', LOWER(CONVERT(VARCHAR(64), HASHBYTES('SHA2_256','alicepass'), 2)), 'inactive', NULL),
    ('Bob','Closer','555-0111','bob', LOWER(CONVERT(VARCHAR(64), HASHBYTES('SHA2_256','bobpass'), 2)), 'inactive', NULL)
) AS source(FirstName,LastName,Phone,Username,PasswordHash,Status,ReferralParentId)
ON target.Username = source.Username
WHEN NOT MATCHED THEN
    INSERT (FirstName,LastName,Phone,Username,PasswordHash,Status,ReferralParentId)
    VALUES (source.FirstName,source.LastName,source.Phone,source.Username,source.PasswordHash,source.Status,source.ReferralParentId);
GO